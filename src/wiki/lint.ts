/**
 * /wiki-lint 구조 검사 — WIKI-SPEC-v2 §2 형식 · wiki-ops.md 불변 규칙의 "기계 검사" 부분.
 * 의미 검증(Fact-Check, Verified 문장 ↔ 원본 insight 대조)은 에이전트가 수행한다 (SKILL.md /wiki-lint).
 *
 * 검사 5종:
 *  1. 프론트매터 — YAML 유효성·필수 필드·id/폴더 정합·스펙 필드 순서(warning)
 *  2. Source Lock — Verified 불릿마다 [source: x], x ∈ source_insights, insight 파일 실존
 *  3. 링크 — related_* 대상 실존, 자기참조(error), 단방향(warning), 고립(warning)
 *  4. Inferred TTL — expires 경과 시 flag, --fix 시 "status: expired" 마킹 (삭제 없음)
 *  5. index.md 정합 — 파일↔목록 일치, --fix 시 통계 블록 재생성
 */
import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { getMemoryDir, resolveRepoRoot } from "../paths.js";

export type LintSeverity = "error" | "warning" | "info";

export interface LintFinding {
  severity: LintSeverity;
  rule: string;
  file: string;
  message: string;
}

export interface LintStats {
  entities: number;
  concepts: number;
  answers: number;
  orphans: number;
  inferredExpired: number;
  inferredValid: number;
}

export interface LintReport {
  findings: LintFinding[];
  stats: LintStats;
  fixedFiles: string[];
  errorCount: number;
  warningCount: number;
}

interface WikiPage {
  /** repo-relative-ish path used in findings (e.g. entities/rag.md) */
  rel: string;
  abs: string;
  folder: "entities" | "concepts";
  fileId: string;
  raw: string;
  frontmatter: Record<string, unknown> | null;
  frontmatterError?: string;
  /** raw key order inside the frontmatter block (regex, works even when YAML fails) */
  keyOrder: string[];
  body: string;
}

const ENTITY_CAP = 80;
const CONCEPT_CAP = 50;

/** WIKI-SPEC-v2 §2 frontmatter 권장 순서 (aliases/entity_type은 type 다음) */
const SPEC_FIELD_ORDER = [
  "id",
  "type",
  "entity_type",
  "aliases",
  "created",
  "updated",
  "source_insights",
  "related_entities",
  "related_concepts",
];

const REQUIRED_FIELDS = ["id", "type", "created", "updated", "source_insights"];

function wikiDir(): string {
  return join(getMemoryDir(), "wiki");
}

function insightsDir(): string {
  return join(getMemoryDir(), "ingest", "insights");
}

function splitFrontmatter(raw: string): { block: string | null; body: string } {
  if (!raw.startsWith("---")) return { block: null, body: raw };
  const rest = raw.slice(raw.indexOf("\n") + 1);
  const endIdx = rest.indexOf("\n---");
  if (endIdx < 0) return { block: null, body: raw };
  // CRLF 파일은 마지막 라인에 \r가 남아 YAML 파서가 실패한다 — 정규화
  const block = rest.slice(0, endIdx).replace(/\r/g, "");
  return { block, body: rest.slice(endIdx + 4) };
}

function extractKeyOrder(block: string): string[] {
  const keys: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([a-z_]+):/i);
    if (m) keys.push(m[1].toLowerCase());
  }
  return keys;
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x)).filter(Boolean);
}

async function loadPages(): Promise<{ pages: WikiPage[]; findings: LintFinding[] }> {
  const findings: LintFinding[] = [];
  const pages: WikiPage[] = [];

  for (const folder of ["entities", "concepts"] as const) {
    const dir = join(wikiDir(), folder);
    if (!existsSync(dir)) continue;
    const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const abs = join(dir, f);
      const raw = await readFile(abs, "utf8");
      const rel = `${folder}/${f}`;
      const { block, body } = splitFrontmatter(raw);
      let frontmatter: Record<string, unknown> | null = null;
      let frontmatterError: string | undefined;
      let keyOrder: string[] = [];
      if (block === null) {
        frontmatterError = "프론트매터 블록 없음 (`---` 시작/종료 쌍 누락)";
      } else {
        keyOrder = extractKeyOrder(block);
        try {
          const parsed = parseYaml(block);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            frontmatter = parsed as Record<string, unknown>;
          } else {
            frontmatterError = "프론트매터가 YAML 매핑이 아님";
          }
        } catch (e) {
          frontmatterError = `YAML 파싱 실패: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`;
        }
      }
      pages.push({
        rel,
        abs,
        folder,
        fileId: f.replace(/\.md$/, ""),
        raw,
        frontmatter,
        frontmatterError,
        keyOrder,
        body,
      });
    }
  }
  return { pages, findings };
}

function checkFrontmatter(page: WikiPage, findings: LintFinding[]): void {
  if (page.frontmatterError || !page.frontmatter) {
    findings.push({
      severity: "error",
      rule: "frontmatter",
      file: page.rel,
      message: page.frontmatterError ?? "프론트매터 파싱 실패",
    });
    return;
  }
  const fm = page.frontmatter;
  for (const field of REQUIRED_FIELDS) {
    if (fm[field] === undefined || fm[field] === null || fm[field] === "") {
      findings.push({
        severity: "error",
        rule: "frontmatter",
        file: page.rel,
        message: `필수 필드 누락: ${field}`,
      });
    }
  }
  const expectedType = page.folder === "entities" ? "entity" : "concept";
  if (typeof fm.type === "string" && fm.type !== expectedType) {
    findings.push({
      severity: "error",
      rule: "frontmatter",
      file: page.rel,
      message: `type=${fm.type} ↔ 폴더(${page.folder}) 불일치`,
    });
  }
  if (page.folder === "entities" && !fm.entity_type) {
    findings.push({
      severity: "error",
      rule: "frontmatter",
      file: page.rel,
      message: "엔티티 필수 필드 누락: entity_type",
    });
  }
  if (typeof fm.id === "string" && fm.id !== page.fileId) {
    findings.push({
      severity: "error",
      rule: "frontmatter",
      file: page.rel,
      message: `id(${fm.id}) ↔ 파일명(${page.fileId}) 불일치`,
    });
  }
  // 필드 순서 — 스펙 §2 순서와 다르면 warning
  const known = page.keyOrder.filter((k) => SPEC_FIELD_ORDER.includes(k));
  const sorted = [...known].sort(
    (a, b) => SPEC_FIELD_ORDER.indexOf(a) - SPEC_FIELD_ORDER.indexOf(b),
  );
  if (known.join(",") !== sorted.join(",")) {
    findings.push({
      severity: "warning",
      rule: "frontmatter-order",
      file: page.rel,
      message: `필드 순서가 스펙 §2와 다름: [${known.join(", ")}]`,
    });
  }
}

function sectionOf(body: string, headingPrefix: string): string | null {
  const lines = body.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## ") && lines[i].slice(3).trimStart().startsWith(headingPrefix)) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

/**
 * [source: …] 태그 내용 분해. 코퍼스 표기 규약:
 *  - 복수 소스는 `,` 또는 `·` 구분: [source: a, b] / [source: a · b]
 *  - insight id 외에 레포 문서 참조 허용: [source: AGENTS.md §1], [source: docs/WIKI-SPEC-v2.md §0]
 */
function splitSourceTokens(tag: string): string[] {
  return tag
    .split(/[,·]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 토큰이 가리키는 원본이 실존하는지 — insight id 우선, .md 포함 시 레포 문서 경로(§절 표기 제거) */
function sourceTokenExists(token: string): { exists: boolean; kind: "insight" | "doc" } {
  if (/\.md/i.test(token)) {
    const path = token.replace(/\s*§.*$/, "").trim();
    return { exists: existsSync(join(resolveRepoRoot(), path)), kind: "doc" };
  }
  return { exists: existsSync(join(insightsDir(), `${token}.md`)), kind: "insight" };
}

function checkSourceLock(page: WikiPage, findings: LintFinding[]): void {
  const verified = sectionOf(page.body, "Verified");
  if (verified === null) {
    findings.push({
      severity: "warning",
      rule: "source-lock",
      file: page.rel,
      message: "`## Verified` 섹션 없음",
    });
    return;
  }
  const sourceInsights = toStringArray(page.frontmatter?.source_insights);
  for (const line of verified.split(/\r?\n/)) {
    const m = line.match(/^[-*]\s+(.+)$/);
    if (!m) continue;
    const tags = [...m[1].matchAll(/\[source:\s*([^\]]+?)\s*\]/g)].map((t) => t[1]);
    if (tags.length === 0) {
      findings.push({
        severity: "error",
        rule: "source-lock",
        file: page.rel,
        message: `Verified 불릿에 [source:] 태그 없음: "${m[1].slice(0, 60)}…"`,
      });
      continue;
    }
    for (const token of tags.flatMap(splitSourceTokens)) {
      const { exists, kind } = sourceTokenExists(token);
      if (!exists) {
        findings.push({
          severity: "error",
          rule: "source-lock",
          file: page.rel,
          message:
            kind === "doc"
              ? `[source: ${token}] 레포 문서 없음`
              : `[source: ${token}] 원본 insight 파일 없음 (memory/ingest/insights/${token}.md)`,
        });
        continue;
      }
      // source_insights 등재 검사는 insight 토큰에만 적용 (문서 참조는 대상 아님)
      if (kind === "insight" && sourceInsights.length > 0 && !sourceInsights.includes(token)) {
        findings.push({
          severity: "warning",
          rule: "source-lock",
          file: page.rel,
          message: `[source: ${token}]가 frontmatter source_insights에 없음`,
        });
      }
    }
  }
}

function checkLinks(pages: WikiPage[], findings: LintFinding[]): Set<string> {
  const byId = new Map<string, WikiPage>();
  for (const p of pages) byId.set(p.fileId, p);

  const referenced = new Set<string>();
  for (const p of pages) {
    const relEntities = toStringArray(p.frontmatter?.related_entities);
    const relConcepts = toStringArray(p.frontmatter?.related_concepts);
    for (const target of [...relEntities, ...relConcepts]) {
      referenced.add(target);
      if (target === p.fileId) {
        findings.push({
          severity: "error",
          rule: "links",
          file: p.rel,
          message: `related_*에 자기참조: ${target}`,
        });
        continue;
      }
      const t = byId.get(target);
      if (!t) {
        findings.push({
          severity: "error",
          rule: "links",
          file: p.rel,
          message: `related_* 대상 없음: ${target}`,
        });
        continue;
      }
      const back = [
        ...toStringArray(t.frontmatter?.related_entities),
        ...toStringArray(t.frontmatter?.related_concepts),
      ];
      if (!back.includes(p.fileId)) {
        findings.push({
          severity: "warning",
          rule: "links",
          file: p.rel,
          message: `단방향 링크: ${p.fileId} → ${target} (역방향 없음, 스펙 §3.4 양방향 필수)`,
        });
      }
    }
  }

  // 고립: 나가는 링크 0 + 들어오는 링크 0
  const orphans = new Set<string>();
  for (const p of pages) {
    const out =
      toStringArray(p.frontmatter?.related_entities).length +
      toStringArray(p.frontmatter?.related_concepts).length;
    if (out === 0 && !referenced.has(p.fileId)) {
      orphans.add(p.fileId);
      findings.push({
        severity: "warning",
        rule: "links",
        file: p.rel,
        message: "고립 페이지: related_* 비어 있고 다른 페이지에서도 참조 없음",
      });
    }
  }
  return orphans;
}

interface TtlResult {
  expired: number;
  valid: number;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Inferred TTL 검사. fix=true면 만료 라인에 " — status: expired"를 덧붙이고
 * frontmatter updated를 오늘로 갱신한 새 본문을 반환한다 (내용 삭제 없음).
 */
function checkInferredTtl(
  page: WikiPage,
  findings: LintFinding[],
  fix: boolean,
): { ttl: TtlResult; fixedRaw?: string } {
  const ttl: TtlResult = { expired: 0, valid: 0 };
  const today = todayIso();
  const lines = page.raw.split(/\r?\n/);
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/expires:\s*(\d{4}-\d{2}-\d{2})/);
    if (!m) continue;
    const alreadyMarked = /status:\s*expired/.test(lines[i]);
    if (m[1] < today) {
      ttl.expired += 1;
      if (!alreadyMarked) {
        findings.push({
          severity: fix ? "info" : "warning",
          rule: "inferred-ttl",
          file: page.rel,
          message: fix
            ? `Inferred 만료(${m[1]}) → status: expired 마킹`
            : `Inferred 만료(${m[1]}) — status: expired 마킹 필요 (--fix)`,
        });
        if (fix) {
          lines[i] = `${lines[i]} — status: expired`;
          changed = true;
        }
      }
    } else {
      ttl.valid += 1;
    }
  }

  if (!changed) return { ttl };

  // frontmatter updated 갱신
  let fixedRaw = lines.join("\n");
  fixedRaw = fixedRaw.replace(/^(updated:\s*)\d{4}-\d{2}-\d{2}\s*$/m, `$1${today}`);
  return { ttl, fixedRaw };
}

async function checkIndex(
  pages: WikiPage[],
  stats: LintStats,
  findings: LintFinding[],
  fix: boolean,
): Promise<boolean> {
  const indexPath = join(wikiDir(), "index.md");
  if (!existsSync(indexPath)) {
    findings.push({
      severity: "error",
      rule: "index",
      file: "index.md",
      message: "index.md 없음",
    });
    return false;
  }
  const raw = await readFile(indexPath, "utf8");

  const listed = new Set<string>();
  for (const m of raw.matchAll(/\]\(((?:entities|concepts)\/[^)]+\.md)\)/g)) {
    listed.add(m[1]);
  }
  for (const p of pages) {
    if (!listed.has(p.rel)) {
      findings.push({
        severity: "error",
        rule: "index",
        file: "index.md",
        message: `디스크에 있으나 index에 없음: ${p.rel}`,
      });
    }
  }
  const onDisk = new Set(pages.map((p) => p.rel));
  for (const rel of listed) {
    if (!onDisk.has(rel)) {
      findings.push({
        severity: "error",
        rule: "index",
        file: "index.md",
        message: `index에 있으나 디스크에 없음: ${rel}`,
      });
    }
  }

  // 통계 블록 재생성 (--fix)
  const statsBlock = [
    "```",
    `엔티티: ${stats.entities}/${ENTITY_CAP} | 컨셉: ${stats.concepts}/${CONCEPT_CAP} | 답변: ${stats.answers} | 고아: ${stats.orphans}`,
    `Inferred TTL: 만료 ${stats.inferredExpired}페이지 | 유효 ${stats.inferredValid}페이지`,
    "```",
  ].join("\n");
  const blockRe = /```\r?\n엔티티:[\s\S]*?```/;
  if (blockRe.test(raw)) {
    const current = raw.match(blockRe)![0].replace(/\r\n/g, "\n");
    if (current !== statsBlock) {
      if (fix) {
        await writeFile(indexPath, raw.replace(blockRe, statsBlock), "utf8");
        findings.push({
          severity: "info",
          rule: "index",
          file: "index.md",
          message: "통계 블록 재생성",
        });
        return true;
      }
      findings.push({
        severity: "warning",
        rule: "index",
        file: "index.md",
        message: "통계 블록이 실태와 다름 (--fix로 재생성)",
      });
    }
  } else {
    findings.push({
      severity: "warning",
      rule: "index",
      file: "index.md",
      message: "통계 블록(```엔티티: …```)을 찾지 못함",
    });
  }
  return false;
}

export async function lintWiki(options?: { fix?: boolean }): Promise<LintReport> {
  const fix = options?.fix ?? false;
  const { pages, findings } = await loadPages();

  for (const p of pages) {
    checkFrontmatter(p, findings);
  }
  for (const p of pages) {
    checkSourceLock(p, findings);
  }
  const orphans = checkLinks(pages, findings);

  const fixedFiles: string[] = [];
  let inferredExpired = 0;
  let inferredValid = 0;
  for (const p of pages) {
    const { ttl, fixedRaw } = checkInferredTtl(p, findings, fix);
    inferredExpired += ttl.expired > 0 ? 1 : 0;
    inferredValid += ttl.expired === 0 && ttl.valid > 0 ? 1 : 0;
    if (fixedRaw !== undefined) {
      await writeFile(p.abs, fixedRaw, "utf8");
      fixedFiles.push(p.rel);
    }
  }

  const answersDir = join(wikiDir(), "answers");
  const answers = existsSync(answersDir)
    ? (await readdir(answersDir)).filter((f) => f.endsWith(".md")).length
    : 0;

  const stats: LintStats = {
    entities: pages.filter((p) => p.folder === "entities").length,
    concepts: pages.filter((p) => p.folder === "concepts").length,
    answers,
    orphans: orphans.size,
    inferredExpired,
    inferredValid,
  };

  const indexFixed = await checkIndex(pages, stats, findings, fix);
  if (indexFixed) fixedFiles.push("index.md");

  // Cap 검사 — 초과 시 병합 후보 제시는 사람 판단 (wiki-ops.md 불변 규칙)
  if (stats.entities >= ENTITY_CAP) {
    findings.push({
      severity: "warning",
      rule: "cap",
      file: "entities/",
      message: `엔티티 Cap 도달 (${stats.entities}/${ENTITY_CAP}) — 병합 후보 검토 필요`,
    });
  }
  if (stats.concepts >= CONCEPT_CAP) {
    findings.push({
      severity: "warning",
      rule: "cap",
      file: "concepts/",
      message: `컨셉 Cap 도달 (${stats.concepts}/${CONCEPT_CAP}) — 병합 후보 검토 필요`,
    });
  }

  return {
    findings,
    stats,
    fixedFiles,
    errorCount: findings.filter((f) => f.severity === "error").length,
    warningCount: findings.filter((f) => f.severity === "warning").length,
  };
}
