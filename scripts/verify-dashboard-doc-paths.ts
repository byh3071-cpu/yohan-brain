#!/usr/bin/env node
/**
 * Goal 1 U4 — dashboard doc path allowlist smoke checks.
 * Run: npx tsx scripts/verify-dashboard-doc-paths.ts
 */

import { existsSync, readFileSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const repoRoot = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."))
const dashboardRoot = join(repoRoot, "dashboard")

function must(cond: boolean, label: string) {
  console.log((cond ? "  ✓ " : "  ✗ ") + label)
  if (!cond) ok = false
}

let ok = true

const { isDocPathAllowed, DOC_SCAN_PREFIXES, DOC_SOURCES } = await import(
  pathToFileURL(join(dashboardRoot, "src/lib/memory.ts")).href
)
const { getMemoryDir, resolveRepoRoot } = await import(
  pathToFileURL(join(dashboardRoot, "src/lib/paths.ts")).href
)

const memoryDir = getMemoryDir()
must(existsSync(memoryDir), `memory dir exists (${memoryDir})`)
must(existsSync(join(resolveRepoRoot(), "memory")), "resolveRepoRoot finds memory")

const pathsSrc = readFileSync(join(dashboardRoot, "src/lib/paths.ts"), "utf8")
must(pathsSrc.includes("YOHAN_OS_ROOT"), "paths.ts honors YOHAN_OS_ROOT")

must(DOC_SOURCES.length >= 10, "DOC_SOURCES populated")
must(DOC_SCAN_PREFIXES.includes("inbox/archive/md_files"), "archive curriculum prefix scanned")
must(isDocPathAllowed("inbox/archive/md_files/현대AI개론/15-MCP.md"), "archive curriculum path allowed")
must(isDocPathAllowed("wiki/entities/mcp.md"), "wiki path allowed")
must(!isDocPathAllowed("inbox/archive/telegram-inbox.md"), "non-md_files archive blocked")
must(!isDocPathAllowed("../secrets.md"), "path traversal blocked")

const sample = join(memoryDir, "inbox", "archive", "md_files", "현대AI개론", "15-MCP.md")
must(existsSync(sample), "sample curriculum file on disk")

if (ok) {
  console.log("✅ verify-dashboard-doc-paths passes")
  process.exit(0)
}
console.log("❌ verify-dashboard-doc-paths failed")
process.exit(1)
