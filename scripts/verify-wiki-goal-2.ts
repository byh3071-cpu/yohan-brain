#!/usr/bin/env node
/** Goal 2 U6 — wiki 4 entities completion smoke checks */

import { readFileSync, readdirSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."))
const wikiEntities = join(repoRoot, "memory/wiki/entities")

const TARGETS = [
  "llm-wiki-gist-why-how.md",
  "supabase-naver-oidc-proxy-github-why-how.md",
  "awesome-design-md-github-why-how.md",
  "anthropic-sdk-python-github-why-how.md",
]

function must(cond: boolean, label: string) {
  console.log((cond ? "  ✓ " : "  ✗ ") + label)
  if (!cond) ok = false
}

let ok = true

for (const file of TARGETS) {
  const path = join(wikiEntities, file)
  const raw = readFileSync(path, "utf8")
  must(!raw.includes("(TODO:"), `${file} has no TODO placeholders`)
  must(!raw.includes("(TODO: 사용자가 정의"), `${file} has definition filled`)
  must(/## Inferred[\s\S]*?\n- [^(TODO]/.test(raw), `${file} has Inferred content`)
  must(raw.includes("## Owner Notes") && !raw.includes("(Yohan이 직접 작성)"), `${file} has Owner Notes`)
}

const index = readFileSync(join(repoRoot, "memory/wiki/index.md"), "utf8")
for (const id of [
  "llm-wiki-gist-why-how",
  "supabase-naver-oidc-proxy-github-why-how",
  "awesome-design-md-github-why-how",
  "anthropic-sdk-python-github-why-how",
]) {
  must(!index.includes(`${id}`) || !index.match(new RegExp(`${id}[\\s\\S]{0,120}TODO`)), `index ${id} line has no TODO`)
}

if (ok) {
  console.log("✅ verify-wiki-goal-2 passes")
  process.exit(0)
}
console.log("❌ verify-wiki-goal-2 failed")
process.exit(1)
