#!/usr/bin/env node
/** Goal 5 — Yohan OS revival: ops docs, health flag, pipeline smoke */

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, statSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const repoRoot = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."))

function runCmd(cmd: string, args: string[]) {
  if (process.platform === "win32" && ["npx", "npm", "pnpm"].includes(cmd)) {
    return execFileSync("cmd.exe", ["/d", "/s", "/c", `${cmd}.cmd`, ...args], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    })
  }
  return execFileSync(cmd, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  })
}

function must(cond: boolean, label: string) {
  console.log((cond ? "  ✓ " : "  ✗ ") + label)
  if (!cond) ok = false
}

let ok = true

const active = parseYaml(readFileSync(join(repoRoot, "memory/active-project.yaml"), "utf8")) as {
  id?: string
}
must(active.id === "yohan-os-revival", "active-project id is yohan-os-revival")

const ops = readFileSync(join(repoRoot, "memory/rules/yohan-os-ops-cuesheet.md"), "utf8")
must(ops.includes("npm run bot"), "ops cuesheet mentions npm run bot")
must(ops.includes("ingest:all"), "ops cuesheet mentions ingest:all")
must(ops.includes("automation:batch"), "ops cuesheet mentions automation:batch")

const sync = readFileSync(join(repoRoot, "memory/rules/multi-pc-sync.md"), "utf8")
must(sync.includes("git-auto-pull.ps1"), "multi-pc-sync documents custom ps1 setup A")
must(sync.includes("install-git-auto-pull.ps1 -Force"), "multi-pc-sync warns against Force install")

const harness = readFileSync(join(repoRoot, "memory/rules/agent-harness.md"), "utf8")
must(harness.includes("yohan-os-ops-cuesheet.md"), "agent-harness links ops cuesheet")

const healthSrc = readFileSync(join(repoRoot, "scripts/telegram-health.ts"), "utf8")
must(healthSrc.includes("--require-lock"), "telegram-health supports --require-lock")

try {
  const out = runCmd("npm", ["run", "telegram:health"])
  must(/Telegram API: ok/.test(out), "telegram:health API ok")
} catch {
  must(false, "telegram:health API ok")
}

const batchLog = join(repoRoot, "memory/logs/automation-batch.log")
must(existsSync(batchLog), "automation-batch.log exists")
const ageMs = Date.now() - statSync(batchLog).mtimeMs
must(ageMs < 7 * 24 * 60 * 60 * 1000, "automation-batch.log touched within 7 days")

must(
  existsSync(join(repoRoot, "memory/inbox/telegram")) ||
    sync.includes("inbox/telegram/YYYY-MM-DD.md") ||
    ops.includes("inbox/telegram/"),
  "telegram inbox path documented",
)

if (!existsSync(join(repoRoot, "dist/index.js"))) {
  must(false, "dist/index.js exists (npm run build)")
} else {
  try {
    const out = runCmd("node", ["scripts/smoke-get-context.mjs"])
    must(/"profile_ok"\s*:\s*true/.test(out), "smoke-get-context profile_ok")
    must(/"active_project_ok"\s*:\s*true/.test(out), "smoke-get-context active_project_ok")
  } catch (e) {
    must(false, `smoke-get-context: ${e instanceof Error ? e.message : e}`)
  }
}

if (ok) {
  console.log("✅ verify-goal-5 passes")
  process.exit(0)
}
console.log("❌ verify-goal-5 failed")
process.exit(1)
