#!/usr/bin/env node
// =============================================================================
// inject-soul.mjs — soul.yaml → {target}/.agents/SOUL.md 멱등 주입
// =============================================================================
// memory/core/inject-core-rules-design.md 의 CORE-RULES:START/END 마커 방식을
// 그대로 본떠 SOUL:START / SOUL:END 마커로 soul 요약을 주입한다.
//
//   - 두 마커 사이만 교체, 바깥(프로젝트 특화)은 보존.
//   - 렌더 본문 SHA256 을 START 태그에 박고, 결과 파일이 기존과 동일하면 no-op (쓰기 스킵).
//   - 따라서 2회 실행해도 git diff 0 (멱등).
//
// 대상 (파일 주입, git):
//   - yohan-brain (이 레포 자신)            → 항상 포함
//   - vhk                                    → env VHK_PATH 또는 형제 ../vhk
//   - vibe-starter-kit                       → env VIBE_STARTER_KIT_PATH 또는 ../vibe-starter-kit
//   (노션 바이브코딩 스타터킷은 git 아님 → 별도 노션 sync, 이 스크립트 범위 밖)
//
// 사용:
//   node scripts/inject-soul.mjs            # dry-run (기본) — 무엇이 바뀔지만 출력
//   node scripts/inject-soul.mjs --write    # 실제 쓰기 (capability gating: 외부 레포 포함)
//   node scripts/inject-soul.mjs --target name=/abs/path [--write]   # 대상 추가
//
// 외부 레포 쓰기는 명시 승인 후(opt-in). 기본 dry-run 인 이유.
// =============================================================================

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const SOUL_YAML = join(repoRoot, "memory", "soul.yaml");
const SOUL_ORIGIN = "yohan-brain/memory/soul.yaml";

const START_PREFIX = "<!-- SOUL:START";
const END_TAG = "<!-- SOUL:END -->";

const args = process.argv.slice(2);
const WRITE = args.includes("--write");

// --- 대상 레포 해석 -----------------------------------------------------------
function resolveTargets() {
  const targets = [{ name: "yohan-brain", path: repoRoot }];

  const sibling = (name) => resolve(repoRoot, "..", name);
  const add = (name, envVar) => {
    const p = process.env[envVar]?.trim() || sibling(name);
    targets.push({ name, path: p });
  };
  add("vhk", "VHK_PATH");
  add("vibe-starter-kit", "VIBE_STARTER_KIT_PATH");

  // --target name=/abs/path 추가분
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--target" && args[i + 1]) {
      const [name, ...rest] = args[i + 1].split("=");
      const p = rest.join("=");
      if (name && p) targets.push({ name, path: resolve(p) });
    }
  }
  return targets;
}

// --- 렌더링 (결정적: 타임스탬프 등 휘발값 금지 → 멱등) ---------------------------
function list(arr) {
  return (arr ?? []).map((s) => `- ${s}`).join("\n");
}

function renderSoulBody(soul) {
  const id = soul.identity ?? {};
  const val = soul.values ?? {};
  const wp = soul.work_process ?? {};
  const voice = soul.voice ?? {};
  const focus = soul.current_focus ?? {};
  const roles = soul.agent_roles ?? {};

  const sections = [];

  sections.push(
    [
      "## IDENTITY",
      "",
      `- **${id.name ?? ""} (${id.alias ?? ""})** · ${id.timezone ?? ""}`,
      `- ${id.one_liner ?? ""}`,
      `- **역할:** ${id.role ?? ""}`,
      `- **업(業):** ${id.vocation ?? ""}`,
      `- **북극성:** ${id.north_star ?? ""}`,
      `- **철학:** ${id.philosophy ?? ""}`,
      `- **키워드:** ${(id.keywords ?? []).join(" · ")}`,
    ].join("\n"),
  );

  sections.push(
    [
      "## VALUES",
      "",
      `- **최우선:** ${val.top ?? ""} (안전을 깨지 않는 선에서)`,
      `- **우선순위:** ${(val.priority ?? []).join(" > ")}`,
    ].join("\n"),
  );

  sections.push(
    [
      "## WORK PROCESS",
      "",
      `- **흐름:** ${wp.flow ?? ""}`,
      `- **원칙:** ${wp.principle ?? ""}`,
      `- **요한:** ${(wp.human_owns ?? []).join(" · ")} / **에이전트:** ${(wp.agent_owns ?? []).join(" · ")}`,
      "- **중단 기준:**",
      ...(wp.stop_criteria ?? []).map((s) => `  - ${s}`),
    ].join("\n"),
  );

  sections.push(
    [
      "## VOICE",
      "",
      `- ${voice.language ?? ""} · ${voice.register ?? ""} · ${voice.structure ?? ""} (${voice.table_threshold ?? ""})`,
      `- 호칭: 사용자=${voice.user_term ?? ""} · 에이전트=${voice.agent_term ?? ""}`,
      `- **금지:** ${(voice.forbidden ?? []).join(" · ")}`,
    ].join("\n"),
  );

  sections.push(["## GUARDRAILS", "", list(soul.guardrails)].join("\n"));

  sections.push(
    [
      "## CURRENT FOCUS",
      `> 갱신 ${focus.updated ?? ""} (가변 — active-project.yaml 과 1:1)`,
      "",
      `- **단기:** ${(focus.short_term ?? []).join(" · ")}`,
      `- **중기:** ${(focus.mid_term ?? []).join(" · ")}`,
    ].join("\n"),
  );

  sections.push(
    [
      "## AGENT ROLES",
      "",
      ...Object.entries(roles).map(([k, v]) => `- **${k}:** ${v}`),
    ].join("\n"),
  );

  return sections.join("\n\n");
}

function buildBlock(soul) {
  const body = renderSoulBody(soul);
  const sha = createHash("sha256").update(body, "utf8").digest("hex").slice(0, 12);
  const startTag = `${START_PREFIX} sha256:${sha} (generated from ${SOUL_ORIGIN} — 직접 편집 금지, 노션 SOUL 에서 다듬고 재렌더) -->`;
  return { block: [startTag, "", body, "", END_TAG].join("\n"), sha };
}

function applyMarkerBlock(existing, block) {
  if (existing !== null) {
    const s = existing.indexOf(START_PREFIX);
    const e = existing.indexOf(END_TAG);
    if (s !== -1 && e !== -1 && e > s) {
      return existing.slice(0, s) + block + existing.slice(e + END_TAG.length);
    }
  }
  // 신규 파일: 마커 블록 + 사람 작성 영역 스캐폴드
  return [
    "# SOUL — 요한 정체성·일하는 방식 (상속)",
    "",
    block,
    "",
    "## 이 프로젝트 특화 (사람이 작성 — sync가 건드리지 않음)",
    "",
    "<!-- 여기부터는 soul 상속 밖입니다. 프로젝트 고유 규칙을 자유롭게 추가하세요. -->",
    "",
  ].join("\n");
}

// --- main --------------------------------------------------------------------
async function main() {
  if (!existsSync(SOUL_YAML)) {
    console.error(`soul.yaml 없음: ${SOUL_YAML}`);
    process.exit(1);
  }

  let soul;
  try {
    soul = parseYaml(await readFile(SOUL_YAML, "utf8"));
  } catch (e) {
    console.error(`soul.yaml 파싱 실패: ${e?.message ?? e}`);
    process.exit(1);
  }

  const { block, sha } = buildBlock(soul);
  const targets = resolveTargets();

  let changed = 0;
  let skipped = 0;
  let missing = 0;

  for (const t of targets) {
    const outPath = join(t.path, ".agents", "SOUL.md");

    // 자기 레포가 아닌 대상이 디렉터리째 없으면 (= 워크스페이스에 없는 형제 레포) skip
    if (t.path !== repoRoot && !existsSync(t.path)) {
      console.log(`- ${t.name.padEnd(18)} SKIP (레포 경로 없음: ${t.path})`);
      missing++;
      continue;
    }

    let existing = null;
    if (existsSync(outPath)) existing = await readFile(outPath, "utf8");

    const next = applyMarkerBlock(existing, block);

    if (existing !== null && existing === next) {
      console.log(`- ${t.name.padEnd(18)} no-op (sha256:${sha})`);
      skipped++;
      continue;
    }

    const action = existing === null ? "create" : "update";
    if (WRITE) {
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, next, "utf8");
      console.log(`- ${t.name.padEnd(18)} ${action.toUpperCase()} → ${outPath}`);
    } else {
      console.log(`- ${t.name.padEnd(18)} would ${action} (dry-run) → ${outPath}`);
    }
    changed++;
  }

  console.log(
    `\nsha256:${sha} · ${WRITE ? "WRITE" : "DRY-RUN"} · changed=${changed} no-op=${skipped} missing=${missing}`,
  );
  if (!WRITE && changed > 0) {
    console.log("→ 실제 적용: node scripts/inject-soul.mjs --write");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
