#!/usr/bin/env node
/** Goal 3 — sync guard · finance wiki · profile.yaml smoke checks */

import { readFileSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const repoRoot = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."))
const wikiConcepts = join(repoRoot, "memory/wiki/concepts")

const FINANCE = [
  "personal-finance-low-energy-top3.md",
  "system-income-leverage-structure.md",
  "self-made-wealth-five-elements.md",
]

function must(cond: boolean, label: string) {
  console.log((cond ? "  ✓ " : "  ✗ ") + label)
  if (!cond) ok = false
}

let ok = true

try {
  parseYaml(readFileSync(join(repoRoot, "memory/profile.yaml"), "utf8"))
  must(true, "profile.yaml parses without error")
} catch (e) {
  must(false, `profile.yaml parses: ${(e as Error).message}`)
}

const harness = readFileSync(join(repoRoot, "memory/rules/agent-harness.md"), "utf8")
must(harness.includes("memory/rules/multi-pc-sync.md"), "agent-harness links multi-pc-sync.md")

const sync = readFileSync(join(repoRoot, "memory/rules/multi-pc-sync.md"), "utf8")
must(sync.includes("git-auto-pull.vbs"), "multi-pc-sync mentions git-auto-pull.vbs")
must(sync.includes("삭제됨") || sync.includes("deleted"), "multi-pc-sync notes auto-pull.ps1 removal")

for (const file of FINANCE) {
  const path = join(wikiConcepts, file)
  const raw = readFileSync(path, "utf8")
  must(!raw.includes("(TODO:"), `${file} has no TODO placeholders`)
  must(!raw.includes("(TODO: 사용자가 정의"), `${file} has definition filled`)
  must(/## Inferred[\s\S]*?\n- [^(TODO]/.test(raw), `${file} has Inferred content`)
  must(raw.includes("## Owner Notes") && !raw.includes("(Yohan이 직접 작성)"), `${file} has Owner Notes`)
  must(/related_concepts: \[[^\]]+\]/.test(raw), `${file} has related_concepts`)
}

const index = readFileSync(join(repoRoot, "memory/wiki/index.md"), "utf8")
for (const id of [
  "personal-finance-low-energy-top3",
  "system-income-leverage-structure",
  "self-made-wealth-five-elements",
]) {
  must(!index.match(new RegExp(`${id}[\\s\\S]{0,120}TODO`)), `index ${id} line has no TODO`)
}

if (ok) {
  console.log("✅ verify-goal-3 passes")
  process.exit(0)
}
console.log("❌ verify-goal-3 failed")
process.exit(1)
