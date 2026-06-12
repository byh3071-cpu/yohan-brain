/**
 * 텔레그램 봇 — 폴링으로 메시지 수신 (로컬, 별도 HTTP 서버 없음).
 * 사진 → OCR(tesseract.js) 후 inbox append · URL 포함 → `ingestUrl` · 텍스트만 → inbox append
 */
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";
import { ingestUrl } from "./ingest/url.js";
import { isPidAlive } from "./pid-alive.js";
import { recognizeImageBuffer } from "./telegram-ocr.js";
import {
  getMemoryDir,
  getTelegramInboxDir,
  resolveRepoRoot,
  telegramDailyInboxPathFromUnix,
  telegramDailyInboxRelPathFromUnix,
} from "./paths.js";

config({ path: join(resolveRepoRoot(), ".env") });

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const allowedChatId = process.env.TELEGRAM_CHAT_ID?.trim();

if (!token) {
  console.error("TELEGRAM_BOT_TOKEN 이 .env 에 없습니다.");
  process.exit(1);
}

const botToken = token;
const telegramApiBase = `https://api.telegram.org/bot${botToken}`;
const telegramFileBase = `https://api.telegram.org/file/bot${botToken}`;

interface TelegramPhotoSize {
  file_id: string;
}

interface TelegramMessage {
  message_id: number;
  date?: number;
  chat: { id: number };
  text?: string;
  caption?: string;
  photo?: TelegramPhotoSize[];
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

class TelegramApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "TelegramApiError";
  }
}

async function callTelegram<T>(
  method: string,
  body: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${telegramApiBase}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const data = (await response.json()) as TelegramApiResponse<T>;
  if (!response.ok || !data.ok || data.result === undefined) {
    throw new TelegramApiError(
      data.error_code ?? response.status,
      data.description ?? `Telegram ${method} failed with HTTP ${response.status}`,
    );
  }
  return data.result;
}

async function sendMessage(
  chatId: number,
  text: string,
  options: { disable_web_page_preview?: boolean } = {},
): Promise<void> {
  await callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    ...options,
  });
}

async function getFileLink(fileId: string): Promise<string> {
  const file = await callTelegram<{ file_path?: string }>("getFile", { file_id: fileId });
  if (!file.file_path) {
    throw new Error("Telegram getFile 응답에 file_path가 없습니다.");
  }
  return `${telegramFileBase}/${file.file_path}`;
}

/** 동일 PC에서 `npm run bot` 이 두 번 뜨면 Telegram 이 409 를 낸다. PID 락으로 한 인스턴스만 허용. */
const LOCK_FILE = join(getMemoryDir(), ".telegram-bot.lock");
const LOCK_MAX_AGE_MS = 86_400_000;

/**
 * `exists` 후 `write` 방식은 두 프로세스가 동시에 통과할 수 있다.
 * `openSync(…, 'wx')` 로 파일 생성이 원자적일 때만 락을 잡는다.
 */
function acquireSingletonLock(): void {
  mkdirSync(getMemoryDir(), { recursive: true });
  const maxAttempts = 10;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const fd = openSync(LOCK_FILE, "wx");
      try {
        writeSync(fd, JSON.stringify({ pid: process.pid, startedAt: Date.now() }), 0, "utf8");
      } finally {
        closeSync(fd);
      }
      return;
    } catch (e: unknown) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== "EEXIST") {
        throw e;
      }
      try {
        const data = JSON.parse(readFileSync(LOCK_FILE, "utf8")) as { pid: number; startedAt: number };
        const stale = Date.now() - data.startedAt > LOCK_MAX_AGE_MS;
        if (stale) {
          unlinkSync(LOCK_FILE);
          continue;
        }
        if (isPidAlive(data.pid)) {
          console.error(
            `텔레그램 봇이 이미 실행 중입니다 (PID ${data.pid}). 다른 터미널·Cursor 터미널의 npm run bot·node 를 모두 종료한 뒤 하나만 실행하세요.`,
          );
          process.exit(1);
        }
        unlinkSync(LOCK_FILE);
      } catch {
        try {
          unlinkSync(LOCK_FILE);
        } catch {
          /* ignore */
        }
      }
    }
  }
  console.error("봇 단일 인스턴스 락을 확보하지 못했습니다. `.telegram-bot.lock` 을 확인하세요.");
  process.exit(1);
}

function releaseSingletonLock(): void {
  try {
    if (!existsSync(LOCK_FILE)) return;
    const data = JSON.parse(readFileSync(LOCK_FILE, "utf8")) as { pid: number };
    if (data.pid === process.pid) unlinkSync(LOCK_FILE);
  } catch {
    /* ignore */
  }
}

acquireSingletonLock();

process.on("exit", () => {
  releaseSingletonLock();
});

/**
 * 동일 업데이트가 두 번 들어오는 경우 방지 (동기적으로만 클레임 — 첫 await 전에 끝낼 것).
 * 프로세스가 두 개면 메모리가 분리되어 중복 답장이 나가므로 `acquireSingletonLock` 이 필수.
 */
const claimedMessageKeys = new Map<string, number>();
const DEDUPE_TTL_MS = 120_000;

function tryClaimMessage(msg: TelegramMessage): boolean {
  const key = `${msg.chat.id}:${msg.message_id}`;
  const now = Date.now();
  for (const [k, t] of claimedMessageKeys) {
    if (now - t > DEDUPE_TTL_MS) claimedMessageKeys.delete(k);
  }
  if (claimedMessageKeys.has(key)) {
    console.warn(`[dedupe] 이미 처리한 메시지 스킵: ${key}`);
    return false;
  }
  claimedMessageKeys.set(key, now);
  return true;
}

function extractHttpUrls(text: string): string[] {
  const re = /\bhttps?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  const found = text.match(re) ?? [];
  return [...new Set(found.map((u) => u.replace(/[),.]+$/g, "")))];
}

function hasHttpUrl(text: string): boolean {
  return extractHttpUrls(text).length > 0;
}

async function appendTextOnlyInbox(text: string, meta: { chatId: number; messageId: number; date?: number }): Promise<void> {
  const tsSec = meta.date ?? Math.floor(Date.now() / 1000);
  const inboxFile = telegramDailyInboxPathFromUnix(tsSec);
  await mkdir(getTelegramInboxDir(), { recursive: true });
  const iso = new Date(tsSec * 1000).toISOString();
  const block = [
    "",
    "---",
    `received_at: ${iso}`,
    `from_chat_id: ${meta.chatId}`,
    `message_id: ${meta.messageId}`,
    "---",
    "",
    text.trim(),
    "",
  ].join("\n");
  await appendFile(inboxFile, block, "utf8");
}

/** 사진 OCR 결과 — type: screenshot + received_at + message_id */
async function appendScreenshotOcrInbox(
  ocrText: string,
  meta: { chatId: number; messageId: number; date?: number },
): Promise<void> {
  const tsSec = meta.date ?? Math.floor(Date.now() / 1000);
  const inboxFile = telegramDailyInboxPathFromUnix(tsSec);
  await mkdir(getTelegramInboxDir(), { recursive: true });
  const iso = new Date(tsSec * 1000).toISOString();
  const body = ocrText.length > 0 ? ocrText : "_(OCR 결과 없음 — 이미지에 인쇄 텍스트가 없을 수 있음)_";
  const block = [
    "",
    "---",
    "type: screenshot",
    `received_at: ${iso}`,
    `message_id: ${meta.messageId}`,
    `from_chat_id: ${meta.chatId}`,
    "---",
    "",
    body,
    "",
  ].join("\n");
  await appendFile(inboxFile, block, "utf8");
}

async function handlePhotoMessage(msg: TelegramMessage): Promise<void> {
  const chatId = msg.chat.id;
  const photos = msg.photo;
  if (!photos || photos.length === 0) return;

  const largest = photos[photos.length - 1];
  const fileId = largest.file_id;

  try {
    const fileUrl = await getFileLink(fileId);
    const res = await fetch(fileUrl);
    if (!res.ok) {
      throw new Error(`이미지 다운로드 실패 HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const text = await recognizeImageBuffer(buf);
    await appendScreenshotOcrInbox(text, {
      chatId,
      messageId: msg.message_id,
      date: msg.date,
    });
    const tsSec = msg.date ?? Math.floor(Date.now() / 1000);
    const relPath = telegramDailyInboxRelPathFromUnix(tsSec);
    const preview = text.length > 0 ? text.slice(0, 100) : "(비어 있음)";
    const suffix = text.length > 100 ? "…" : "";
    await sendMessage(
      chatId,
      `OCR 완료 · 미리보기(100자):\n${preview}${suffix}\n\n→ ${relPath}`,
      { disable_web_page_preview: true },
    );
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.error("[photo/ocr]", err);
    await sendMessage(chatId, `사진 처리 실패: ${err}`);
  }
}

async function onMessage(msg: TelegramMessage): Promise<void> {
  if (!tryClaimMessage(msg)) {
    return;
  }

  const chatId = msg.chat.id;
  if (allowedChatId && String(chatId) !== allowedChatId) {
    console.warn(`[skip] chat ${chatId} (allowed: ${allowedChatId})`);
    return;
  }

  if (msg.photo && msg.photo.length > 0) {
    await handlePhotoMessage(msg);
    return;
  }

  const text = msg.text ?? msg.caption ?? "";
  if (!text.trim()) {
    return;
  }

  try {
    if (hasHttpUrl(text)) {
      const urls = extractHttpUrls(text);
      const lines: string[] = [];
      for (const url of urls) {
        const r = await ingestUrl(url);
        if (r.error) {
          lines.push(`• ${url}\n  오류: ${r.error}`);
        } else if (r.skipped) {
          lines.push(`• ${url}\n  이미 있음: ${r.out_path}`);
        } else {
          lines.push(`• ${url}\n  저장: ${r.out_path}`);
        }
      }
      await sendMessage(chatId, ["ingest_url 완료:", ...lines].join("\n"), { disable_web_page_preview: true });
    } else {
      await appendTextOnlyInbox(text, {
        chatId,
        messageId: msg.message_id,
        date: msg.date,
      });
      const tsSec = msg.date ?? Math.floor(Date.now() / 1000);
      const relPath = telegramDailyInboxRelPathFromUnix(tsSec);
      await sendMessage(chatId, `${relPath} 에 기록했습니다.`);
    }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.error(err);
    await sendMessage(chatId, `처리 실패: ${err}`);
  }
}

/**
 * 409 는 같은 토큰으로 다른 getUpdates가 실행 중이라는 뜻이다.
 * 프로세스당 안내는 한 번만 출력한다.
 */
let printed409Guide = false;

function reportPollingError(err: unknown): void {
  if (err instanceof TelegramApiError && err.status === 409) {
    if (!printed409Guide) {
      printed409Guide = true;
      console.error(
        "[polling_error] 409 Conflict — 동일 봇 토큰으로 다른 getUpdates 가 이미 돌고 있습니다.",
      );
      console.error(
        "  → 다른 터미널·백그라운드의 `npm run bot` / node 를 모두 종료한 뒤 하나만 실행하세요.",
      );
      console.error("  → 다른 PC·호스팅에서 같은 봇을 쓰는 경우도 동일합니다.");
      console.error(
        "  (이후 동일 오류는 반복 출력하지 않습니다. 3초 뒤 다시 시도합니다.)",
      );
    }
    return;
  }
  console.error("[polling_error]", err instanceof Error ? err.message : String(err));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const pollingController = new AbortController();
let stopping = false;

function requestShutdown(): void {
  if (stopping) return;
  stopping = true;
  pollingController.abort();
}

process.once("SIGINT", requestShutdown);
process.once("SIGTERM", requestShutdown);

async function pollUpdates(): Promise<void> {
  let offset = 0;
  while (!stopping) {
    try {
      const updates = await callTelegram<TelegramUpdate[]>(
        "getUpdates",
        {
          offset,
          timeout: 25,
          allowed_updates: ["message"],
        },
        pollingController.signal,
      );
      for (const update of updates) {
        offset = Math.max(offset, update.update_id + 1);
        if (update.message) await onMessage(update.message);
      }
    } catch (e) {
      if (stopping || (e instanceof Error && e.name === "AbortError")) break;
      reportPollingError(e);
      await sleep(3000);
    }
  }
}

async function bootstrap(): Promise<void> {
  /** 웹훅이 남아 있으면 getUpdates(폴링)과 충돌할 수 있음 */
  await callTelegram("deleteWebhook", { drop_pending_updates: false });
  /** 이전 프로세스의 연결이 서버에서 끊기기까지 짧게 대기 (409 완화) */
  await sleep(1500);
  console.log("Telegram bot polling… (Ctrl+C 로 종료)");
  if (allowedChatId) {
    console.log(`허용 chat_id: ${allowedChatId}`);
  } else {
    console.warn("TELEGRAM_CHAT_ID 가 비어 있습니다. 모든 채팅의 메시지를 처리합니다.");
  }
  await pollUpdates();
  releaseSingletonLock();
  console.log("Telegram bot polling stopped.");
}

void bootstrap().catch((e) => {
  console.error("봇 시작 실패:", e);
  process.exit(1);
});
