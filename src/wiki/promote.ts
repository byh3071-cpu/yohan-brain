import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { getMemoryDir, resolveRepoRoot } from "../paths.js";

export type WikiType = "concept" | "entity";
export type EntityType = "person" | "company" | "technology" | "tool" | "other";

export interface PromoteOptions {
  insightPath: string;
  type?: WikiType;
  entityType?: EntityType;
  /** Override the wiki id slug (default: insight id) */
  id?: string;
  /** Owner of the file mtime/created date (default: today) */
  today?: string;
}

export interface PromoteResult {
  ok: true;
  wiki_path: string;
  wiki_rel: string;
  id: string;
  type: WikiType;
  index_updated: boolean;
  log_updated: boolean;
}

export interface PromoteError {
  ok: false;
  error: string;
}

export interface SuggestionItem {
  insight_id: string;
  insight_rel: string;
  title: string;
  tags: string[];
  archive_tier?: string;
  reason: string;
}

const TELEGRAM_PREFIX = "telegram-ocr";

/**
 * Frontmatter in insights is mixed: some files have proper YAML, others have
 * `## id: ...` lines or commented entries inside the `---` block. Parse what we
 * can with YAML, fall back to line-by-line regex for known keys.
 */
function extractInsightFrontmatter(raw: string): {
  id?: string;
  date?: string;
  tags: string[];
  related: string[];
  status?: string;
  archive_tier?: string;
} {
  const result = {
    id: undefined as string | undefined,
    date: undefined as string | undefined,
    tags: [] as string[],
    related: [] as string[],
    status: undefined as string | undefined,
    archive_tier: undefined as string | undefined,
  };

  if (!raw.startsWith("---")) return result;
  const rest = raw.slice(raw.indexOf("\n") + 1);
  const endIdx = rest.indexOf("\n---");
  if (endIdx < 0) return result;
  const block = rest.slice(0, endIdx);

  try {
    const parsed = parseYaml(block);
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      if (typeof obj.id === "string") result.id = obj.id;
      if (typeof obj.date === "string") result.date = obj.date;
      if (Array.isArray(obj.tags)) result.tags = obj.tags.map((t) => String(t));
      if (Array.isArray(obj.related)) result.related = obj.related.map((t) => String(t));
      if (typeof obj.status === "string") result.status = obj.status;
      if (typeof obj.archive_tier === "string") result.archive_tier = obj.archive_tier;
    }
  } catch {
    // fall through to regex fallback
  }

  for (const line of block.split(/\r?\n/)) {
    const trimmed = line.trim().replace(/^#\s*/, "").replace(/^##\s*/, "");
    const m = trimmed.match(/^([a-z_]+):\s*(.+?)\s*$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2];
    if (key === "id" && !result.id) result.id = value;
    else if (key === "date" && !result.date) result.date = value;
    else if (key === "status" && !result.status) result.status = value;
    else if (key === "archive_tier" && !result.archive_tier) {
      result.archive_tier = value.split("#")[0].trim();
    } else if (key === "tags" && result.tags.length === 0) {
      const arr = value.match(/^\[(.*)\]$/);
      if (arr) result.tags = arr[1].split(",").map((s) => s.trim()).filter(Boolean);
    } else if (key === "related" && result.related.length === 0) {
      const arr = value.match(/^\[(.*)\]$/);
      if (arr) result.related = arr[1].split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return result;
}

function extractInsightBody(raw: string): string {
  if (!raw.startsWith("---")) return raw;
  const rest = raw.slice(raw.indexOf("\n") + 1);
  const endIdx = rest.indexOf("\n---");
  if (endIdx < 0) return raw;
  return rest.slice(endIdx + 4);
}

function extractTitle(body: string, fallback: string): string {
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1];
  }
  return fallback;
}

/** Extract top-level bullet points to seed Verified section. Cap at 6. */
function extractTopBullets(body: string, limit = 6): string[] {
  const lines = body.split(/\r?\n/);
  const bullets: string[] = [];
  for (const line of lines) {
    const m = line.match(/^[-*]\s+(.+?)\s*$/);
    if (!m) continue;
    const text = m[1].trim();
    if (text.length < 8) continue;
    bullets.push(text);
    if (bullets.length >= limit) break;
  }
  return bullets;
}

function slugifyId(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function resolveInsightPath(input: string): string {
  if (isAbsolute(input)) return input;
  const repoRoot = resolveRepoRoot();
  return resolve(repoRoot, input);
}

/** Walk all wiki entity+concept files; return parsed frontmatter list. */
async function readWikiPages(memoryRoot: string): Promise<
  Array<{ path: string; rel: string; id: string; type: string; source_insights: string[] }>
> {
  const wikiRoot = join(memoryRoot, "wiki");
  const out: Array<{ path: string; rel: string; id: string; type: string; source_insights: string[] }> = [];
  for (const sub of ["entities", "concepts"] as const) {
    const dir = join(wikiRoot, sub);
    if (!existsSync(dir)) continue;
    const names = await readdir(dir);
    for (const name of names) {
      if (!name.endsWith(".md")) continue;
      const path = join(dir, name);
      const raw = await readFile(path, "utf8");
      const fm = extractInsightFrontmatter(raw);
      const sourceMatches = raw.match(/^source_insights:\s*\[(.*)\]/m);
      const sources = sourceMatches
        ? sourceMatches[1].split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const idMatch = raw.match(/^id:\s*(.+?)\s*$/m);
      const typeMatch = raw.match(/^type:\s*(.+?)\s*$/m);
      out.push({
        path,
        rel: `memory/wiki/${sub}/${name}`,
        id: idMatch ? idMatch[1] : fm.id ?? name.replace(/\.md$/, ""),
        type: typeMatch ? typeMatch[1] : sub === "entities" ? "entity" : "concept",
        source_insights: sources,
      });
    }
  }
  return out;
}

function buildWikiContent(args: {
  id: string;
  type: WikiType;
  entityType?: EntityType;
  aliases: string[];
  title: string;
  today: string;
  insightId: string;
  bullets: string[];
}): string {
  const { id, type, entityType, aliases, title, today, insightId, bullets } = args;

  const fm: string[] = [
    "---",
    `id: ${id}`,
    `type: ${type}`,
  ];
  if (type === "entity") {
    fm.push(`entity_type: ${entityType ?? "other"}`);
  } else {
    const aliasList = aliases.length > 0 ? `[${aliases.join(", ")}]` : "[]";
    fm.push(`aliases: ${aliasList}`);
  }
  fm.push(
    `created: ${today}`,
    `updated: ${today}`,
    `source_insights: [${insightId}]`,
    "related_entities: []",
    "related_concepts: []",
    "---",
    "",
  );

  const body: string[] = [
    `# ${title}`,
    "",
    "## 정의 (1~2문장)",
    "- (TODO: 사용자가 정의 1~2문장 작성)",
    "",
    "## Verified (소스 기반)",
  ];
  if (bullets.length === 0) {
    body.push(`- (TODO: ${insightId}에서 핵심 사실 추출) [source: ${insightId}]`);
  } else {
    for (const b of bullets) {
      body.push(`- ${b} [source: ${insightId}]`);
    }
  }

  const expires = addDaysIso(today, 30);
  body.push(
    "",
    "## Inferred (추론/연결) — TTL 30일",
    "- (TODO: 소스 간 연결로 도출한 추론을 적는다.)",
    `- created: ${today}, expires: ${expires}`,
    "",
    "## Owner Notes",
    "- (Yohan이 직접 작성)",
    "",
    "## 관련 소스",
    `- [${insightId}](../../ingest/insights/${insightId}.md)`,
    "",
  );

  return fm.join("\n") + body.join("\n");
}

async function appendIndexEntry(args: {
  memoryRoot: string;
  type: WikiType;
  id: string;
  title: string;
}): Promise<boolean> {
  const { memoryRoot, type, id, title } = args;
  const indexPath = join(memoryRoot, "wiki", "index.md");
  if (!existsSync(indexPath)) return false;
  const raw = await readFile(indexPath, "utf8");
  const folder = type === "entity" ? "entities" : "concepts";
  const heading = type === "entity" ? "## Entities" : "## Concepts";
  const trimmedTitle = title.length > 80 ? `${title.slice(0, 78)}…` : title;
  const newLine = `- [${id}](${folder}/${id}.md) — ${trimmedTitle}. (TODO: 한 줄 설명 보강)`;

  if (raw.includes(`](${folder}/${id}.md)`)) return false;

  const lines = raw.split(/\r?\n/);
  const headingIdx = lines.findIndex((l) => l.trim() === heading);
  if (headingIdx < 0) {
    lines.push("", heading, "", newLine, "");
  } else {
    let insertAt = lines.length;
    for (let i = headingIdx + 1; i < lines.length; i += 1) {
      const t = lines[i].trim();
      if (t.startsWith("## ")) {
        insertAt = i;
        break;
      }
    }
    while (insertAt > headingIdx + 1 && lines[insertAt - 1].trim() === "") {
      insertAt -= 1;
    }
    lines.splice(insertAt, 0, newLine);
  }

  const updatedHeader = lines
    .map((l) => (l.startsWith("updated:") ? `updated: ${todayIso()}` : l))
    .join("\n");
  await writeFile(indexPath, updatedHeader, "utf8");
  return true;
}

async function appendLogEntry(args: {
  memoryRoot: string;
  message: string;
  today: string;
}): Promise<boolean> {
  const { memoryRoot, message, today } = args;
  const logPath = join(memoryRoot, "wiki", "log.md");
  if (!existsSync(logPath)) return false;
  const raw = await readFile(logPath, "utf8");
  const lines = raw.split(/\r?\n/);

  const dayHeading = `## ${today}`;
  let updated: string;
  if (lines.some((l) => l.trim() === dayHeading)) {
    const idx = lines.findIndex((l) => l.trim() === dayHeading);
    let insertAt = lines.length;
    for (let i = idx + 1; i < lines.length; i += 1) {
      if (lines[i].trim().startsWith("## ")) {
        insertAt = i;
        break;
      }
    }
    while (insertAt > idx + 1 && lines[insertAt - 1].trim() === "") {
      insertAt -= 1;
    }
    lines.splice(insertAt, 0, `- ${message}`);
    updated = lines.join("\n");
  } else {
    updated = `${raw.replace(/\s+$/, "")}\n\n${dayHeading}\n\n- ${message}\n`;
  }

  const final = updated
    .split(/\r?\n/)
    .map((l) => (l.startsWith("updated:") ? `updated: ${today}` : l))
    .join("\n");

  await writeFile(logPath, final, "utf8");
  return true;
}

export async function promoteToWiki(options: PromoteOptions): Promise<PromoteResult | PromoteError> {
  const insightAbs = resolveInsightPath(options.insightPath);
  if (!existsSync(insightAbs)) {
    return { ok: false, error: `insight 파일 없음: ${insightAbs}` };
  }

  const raw = await readFile(insightAbs, "utf8");
  const fm = extractInsightFrontmatter(raw);
  const body = extractInsightBody(raw);

  const insightId = fm.id ?? basename(insightAbs).replace(/\.md$/, "");
  const baseTitle = extractTitle(body, insightId);
  const today = options.today ?? todayIso();
  const type: WikiType = options.type ?? "concept";
  const entityType = options.entityType;
  const id = slugifyId(options.id ?? insightId);

  if (insightId.startsWith(TELEGRAM_PREFIX)) {
    return { ok: false, error: `텔레그램 OCR insight는 자동 승격 대상 아님 (${insightId})` };
  }

  const memoryRoot = getMemoryDir();
  const existingPages = await readWikiPages(memoryRoot);
  const duplicate = existingPages.find((p) => p.id === id);
  if (duplicate) {
    return { ok: false, error: `이미 wiki에 존재: ${duplicate.rel}` };
  }

  const folder = type === "entity" ? "entities" : "concepts";
  const wikiDir = join(memoryRoot, "wiki", folder);
  await mkdir(wikiDir, { recursive: true });
  const wikiPath = join(wikiDir, `${id}.md`);
  if (existsSync(wikiPath)) {
    return { ok: false, error: `같은 경로 파일 존재: ${wikiPath}` };
  }

  const tags = fm.tags ?? [];
  const aliases = tags.filter((t) => /[가-힣]/.test(t)).slice(0, 4);

  const bullets = extractTopBullets(body);
  const content = buildWikiContent({
    id,
    type,
    entityType,
    aliases,
    title: baseTitle,
    today,
    insightId,
    bullets,
  });
  await writeFile(wikiPath, content, "utf8");

  const indexUpdated = await appendIndexEntry({
    memoryRoot,
    type,
    id,
    title: baseTitle,
  });
  const logUpdated = await appendLogEntry({
    memoryRoot,
    message: `**PROMOTE** ${insightId} → ${folder}/${id}.md`,
    today,
  });

  const repoRoot = resolveRepoRoot();
  return {
    ok: true,
    wiki_path: wikiPath,
    wiki_rel: relative(repoRoot, wikiPath).replace(/\\/g, "/"),
    id,
    type,
    index_updated: indexUpdated,
    log_updated: logUpdated,
  };
}

export interface SuggestOptions {
  limit?: number;
  includeDraft?: boolean;
}

export interface SuggestResult {
  ok: true;
  total_insights: number;
  already_in_wiki: number;
  skipped_telegram: number;
  skipped_draft: number;
  suggestions: SuggestionItem[];
}

export async function suggestPromotions(options: SuggestOptions = {}): Promise<SuggestResult> {
  const limit = options.limit ?? 10;
  const includeDraft = options.includeDraft ?? false;
  const memoryRoot = getMemoryDir();
  const insightsDir = join(memoryRoot, "ingest", "insights");

  const existingPages = await readWikiPages(memoryRoot);
  const promotedIds = new Set<string>();
  for (const page of existingPages) {
    for (const src of page.source_insights) promotedIds.add(src);
  }

  let total = 0;
  let skippedTelegram = 0;
  let skippedDraft = 0;
  let alreadyInWiki = 0;
  const candidates: Array<SuggestionItem & { mtime: number; tierScore: number }> = [];

  if (!existsSync(insightsDir)) {
    return {
      ok: true,
      total_insights: 0,
      already_in_wiki: 0,
      skipped_telegram: 0,
      skipped_draft: 0,
      suggestions: [],
    };
  }

  const files = await readdir(insightsDir);
  for (const name of files) {
    if (!name.endsWith(".md")) continue;
    total += 1;
    const id = name.replace(/\.md$/, "");
    if (id.startsWith(TELEGRAM_PREFIX)) {
      skippedTelegram += 1;
      continue;
    }
    if (promotedIds.has(id)) {
      alreadyInWiki += 1;
      continue;
    }
    const path = join(insightsDir, name);
    const raw = await readFile(path, "utf8");
    const fm = extractInsightFrontmatter(raw);
    if (!includeDraft && fm.status === "draft") {
      skippedDraft += 1;
      continue;
    }
    const body = extractInsightBody(raw);
    const title = extractTitle(body, fm.id ?? id);
    const tier = fm.archive_tier?.toLowerCase();
    const tierScore = tier === "long_term" ? 3 : tier === "standard" ? 2 : tier === "light" ? 1 : 0;
    const s = await stat(path);

    const reasonParts: string[] = [];
    if (tier) reasonParts.push(`tier=${tier}`);
    if (fm.status) reasonParts.push(`status=${fm.status}`);
    if (fm.tags.length > 0) reasonParts.push(`tags=${fm.tags.slice(0, 3).join(",")}`);

    candidates.push({
      insight_id: fm.id ?? id,
      insight_rel: `memory/ingest/insights/${name}`,
      title,
      tags: fm.tags,
      archive_tier: tier,
      reason: reasonParts.join(" | ") || "신규 insight",
      mtime: s.mtimeMs,
      tierScore,
    });
  }

  candidates.sort((a, b) => {
    if (b.tierScore !== a.tierScore) return b.tierScore - a.tierScore;
    return b.mtime - a.mtime;
  });

  const suggestions: SuggestionItem[] = candidates.slice(0, limit).map((c) => ({
    insight_id: c.insight_id,
    insight_rel: c.insight_rel,
    title: c.title,
    tags: c.tags,
    archive_tier: c.archive_tier,
    reason: c.reason,
  }));

  return {
    ok: true,
    total_insights: total,
    already_in_wiki: alreadyInWiki,
    skipped_telegram: skippedTelegram,
    skipped_draft: skippedDraft,
    suggestions,
  };
}

// Re-export resolveInsightPath helper for the CLI to reuse path resolution.
export const __test = { resolveInsightPath, extractInsightFrontmatter, extractTopBullets };
