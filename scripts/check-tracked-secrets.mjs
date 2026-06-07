#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { readFileSync, statSync } from "node:fs"
import { extname, resolve } from "node:path"

const MAX_FILE_BYTES = 512 * 1024
const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdc",
  ".mjs",
  ".ps1",
  ".sh",
  ".toml",
  ".ts",
  ".tsx",
  ".vbs",
  ".yaml",
  ".yml",
])

const PATTERNS = [
  {
    name: "literal Bearer credential",
    regex: /Authorization\s*:\s*Bearer\s+(?!\$\{)[A-Za-z0-9._~+/-]{16,}/i,
  },
  { name: "AWS access key", regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "GitHub token", regex: /\bgh[oprsu]_[A-Za-z0-9]{30,}\b/ },
  { name: "Notion token", regex: /\bsecret_[A-Za-z0-9]{40,50}\b/ },
  {
    name: "OpenAI-style key",
    regex: /\bsk-(?:proj-|ant-api03-|live-)[A-Za-z0-9_-]{16,}\b/,
  },
  {
    name: "inline private key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
]

function listCandidateFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8" },
  )
  return output.split("\0").filter(Boolean)
}

const findings = []

for (const relPath of listCandidateFiles()) {
  if (relPath === ".env" || relPath.startsWith(".env.")) continue
  if (!TEXT_EXTENSIONS.has(extname(relPath).toLowerCase())) continue

  const absPath = resolve(relPath)
  let size = 0
  try {
    size = statSync(absPath).size
  } catch {
    continue
  }
  if (size > MAX_FILE_BYTES) continue

  let content = ""
  try {
    content = readFileSync(absPath, "utf8")
  } catch {
    continue
  }

  for (const [index, line] of content.split(/\r?\n/).entries()) {
    for (const pattern of PATTERNS) {
      if (pattern.regex.test(line)) {
        findings.push(`${relPath}:${index + 1} ${pattern.name}`)
      }
    }
  }
}

if (findings.length > 0) {
  console.error("Tracked/unignored secret scan failed:")
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}

console.log("Tracked/unignored secret scan passed.")
