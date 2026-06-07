#!/usr/bin/env node
/** Goal 4 — sync guard follow-up: docs, setup scripts, get_context E2E */

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."))

function runCmd(cmd: string, args: string[]) {
  if (process.platform === "win32" && ["npx", "npm", "pnpm"].includes(cmd)) {
    execFileSync("cmd.exe", ["/d", "/s", "/c", `${cmd}.cmd`, ...args], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: 8 * 1024 * 1024,
    })
    return
  }
  execFileSync(cmd, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    maxBuffer: 8 * 1024 * 1024,
  })
}

function must(cond: boolean, label: string) {
  console.log((cond ? "  ✓ " : "  ✗ ") + label)
  if (!cond) ok = false
}

let ok = true

const sync = readFileSync(join(repoRoot, "memory/rules/multi-pc-sync.md"), "utf8")
must(sync.includes("AutomationBatch vs 수동 git"), "multi-pc-sync has batch guard section")
must(sync.includes("Disable-ScheduledTask"), "multi-pc-sync documents batch disable")
must(sync.includes("staged 변경 소실"), "multi-pc-sync cites staged loss incident")
must(sync.includes("install-git-auto-pull.ps1"), "multi-pc-sync references install script")
must(sync.includes("task-scheduler-auto-pull-setup.ps1"), "multi-pc-sync references scheduler setup")
must(sync.includes("버전 관리 경계"), "multi-pc-sync has version boundary table")

for (const rel of [
  "scripts/git-auto-pull.template.vbs",
  "scripts/install-git-auto-pull.ps1",
  "scripts/task-scheduler-auto-pull-setup.ps1",
  "auto-pull-hidden.vbs",
]) {
  must(existsSync(join(repoRoot, rel)), `${rel} exists`)
}

const template = readFileSync(join(repoRoot, "scripts/git-auto-pull.template.vbs"), "utf8")
must(template.includes("__YOHAN_OS_REPO__"), "template has repo placeholder")
must(template.includes("git pull --rebase"), "template runs git pull --rebase")

const setup = readFileSync(join(repoRoot, "scripts/task-scheduler-auto-pull-setup.ps1"), "utf8")
must(setup.includes("YohanAutoPull"), "scheduler setup registers YohanAutoPull")
must(setup.includes("auto-pull-hidden.vbs"), "scheduler setup points to auto-pull-hidden.vbs")

if (!existsSync(join(repoRoot, "dist/index.js"))) {
  must(false, "dist/index.js exists (run npm run build for smoke-get-context)")
} else {
  try {
    const out = execFileSync("node", ["scripts/smoke-get-context.mjs"], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    })
    must(/"profile_ok"\s*:\s*true/.test(out), "smoke-get-context profile_ok")
    must(/"active_project_ok"\s*:\s*true/.test(out), "smoke-get-context active_project_ok")
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    must(false, `smoke-get-context: ${msg}`)
  }
}

// Goal 3 regression — still passes doc/wiki/profile parse slice
try {
  runCmd("npx", ["tsx", "scripts/verify-goal-3.ts"])
  must(true, "verify-goal-3 regression pass")
} catch {
  must(false, "verify-goal-3 regression pass")
}

if (ok) {
  console.log("✅ verify-goal-4 passes")
  process.exit(0)
}
console.log("❌ verify-goal-4 failed")
process.exit(1)
