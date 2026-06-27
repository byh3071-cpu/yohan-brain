#!/usr/bin/env node
/**
 * check-ecosystem.mjs — validate ecosystem-contract + inheritance-registry
 * No yaml dependency — regex parse for CI portability.
 * Exit 0 = pass, 1 = fail
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const core = join(root, 'memory/core')

const GITHUB_REPOS = [
  'vhk', 'talos', 'boot-auto-pull-setup', 'yohan-cc-skills', 'youth-support-discord',
  'yohan-brain', 'yohan-control-tower', 'yohan-mcp', 'yohan-studio', 'youtube-summary',
  'atelier-ai', 'mova', 'cafe-pos-vhk', 'snapcontext', 'shotgrade', 'haruchi-game',
  'yohan-dca-bot', 'bamgolmok', 'kpocha', 'yohan-ai-dictionary', 'auto-trader',
  'news-automation', 'yohan-os', 'vhk-project', 'notion-uiux', 'flexible-world',
  'desktop-tutorial', 'vibe-starter-kit', 'yohan-profile-card', 'flexible',
  'changeopradar', 'dopamine-runner', 'ai-router', 'hamster-damagochi', '---',
  'dopamine-runner1', 'mazinpro',
]

const VALID_TIERS = new Set(['S', 'A', 'B', 'C', 'D', 'special'])
const VIRTUAL_REPOS = new Set(['yohan-brain-dashboard'])

function fail(msg) {
  console.error(`[check-ecosystem] FAIL: ${msg}`)
  process.exit(1)
}

function ok(msg) {
  console.log(`[check-ecosystem] OK: ${msg}`)
}

function read(path) {
  return readFileSync(path, 'utf8')
}

function extractScalar(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*["']?([^"'\\n#]+)`, 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
}

function extractRepoTiers(registryText) {
  const repos = {}
  const lines = registryText.split('\n')
  let current = null
  for (const line of lines) {
    const quoted = line.match(/^  "([^"]+)":\s*$/)
    const plain = line.match(/^  ([a-z0-9.-]+):\s*$/)
    if (quoted) {
      current = quoted[1]
      repos[current] = {}
      continue
    }
    if (plain) {
      current = plain[1]
      repos[current] = {}
      continue
    }
    if (current) {
      const tierMatch = line.match(/^    tier:\s+(\S+)/)
      if (tierMatch) repos[current].tier = tierMatch[1]
    }
  }
  return repos
}

const contractText = read(join(core, 'ecosystem-contract.yaml'))
const registryText = read(join(core, 'inheritance-registry.yaml'))

if (!contractText.includes('schema: ecosystem-contract')) fail('contract.schema missing')
if (!registryText.includes('schema: inheritance-registry')) fail('registry.schema missing')

const contractVersion = extractScalar(contractText, 'version')
const registryVersion = extractScalar(registryText, 'contract_version')
const status = extractScalar(contractText, 'status')

if (!contractVersion) fail('contract.version missing')
if (registryVersion !== contractVersion) {
  fail(`version mismatch: contract=${contractVersion} registry=${registryVersion}`)
}
ok(`version ${contractVersion} matched`)

if (!status || !['draft', 'active'].includes(status)) fail('contract.status must be draft|active')

const repos = extractRepoTiers(registryText)
const names = Object.keys(repos)
if (names.length === 0) fail('registry repos empty')

for (const [name, entry] of Object.entries(repos)) {
  if (!entry.tier) fail(`repo ${name}: tier missing`)
  if (!VALID_TIERS.has(entry.tier)) fail(`repo ${name}: invalid tier ${entry.tier}`)
}
ok(`${names.length} registry entries, tiers valid`)

for (const gh of GITHUB_REPOS) {
  if (!repos[gh]) fail(`GitHub repo missing from registry: ${gh}`)
}
ok(`GitHub repo coverage ${GITHUB_REPOS.length}/${GITHUB_REPOS.length}`)

for (const name of names) {
  if (VIRTUAL_REPOS.has(name)) continue
  if (!GITHUB_REPOS.includes(name)) {
    console.warn(`[check-ecosystem] WARN: registry entry not in GitHub list: ${name}`)
  }
}

if (!contractText.includes('inheritance-registry.yaml')) {
  fail('contract.registry_ref must mention inheritance-registry.yaml')
}

console.log('[check-ecosystem] ALL PASSED')
process.exit(0)
