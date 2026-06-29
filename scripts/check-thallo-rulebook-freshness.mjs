#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const canonical = resolve(repoRoot, 'api/_data/thallo/organisation-rulebook.md')
const pdf = resolve(repoRoot, 'api/_data/thallo/organisation-rulebook.pdf')
const runtime = '/Users/user/.hermes/thallo-org/organisation-rulebook.md'

function sha(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function meta(text, key) {
  return text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? ''
}

if (!existsSync(canonical)) {
  console.error(`Missing canonical rule book: ${canonical}`)
  process.exit(1)
}

if (!existsSync(pdf)) {
  console.error(`Missing generated PDF rule book: ${pdf}`)
  process.exit(1)
}

const canonicalText = readFileSync(canonical, 'utf8')
const canonicalHash = createHash('sha256').update(canonicalText).digest('hex')
const version = meta(canonicalText, 'rulebook_version')
const updated = meta(canonicalText, 'last_updated')

if (!version || !updated) {
  console.error('Rule book metadata missing rulebook_version or last_updated')
  process.exit(1)
}

if (process.env.SYNC_THALLO_RULEBOOK_RUNTIME !== '1') {
  console.log(`Rule book deploy artifacts present: ${canonicalHash} version ${version} updated ${updated}`)
  console.log('Runtime sync skipped; set SYNC_THALLO_RULEBOOK_RUNTIME=1 for local Hermes runtime sync.')
  process.exit(0)
}

if (!existsSync(dirname(runtime))) {
  console.log(`Rule book canonical present: ${canonicalHash}`)
  console.log('Runtime sync skipped outside local Hermes host.')
  process.exit(0)
}

copyFileSync(canonical, runtime)
const runtimeHash = sha(runtime)

if (canonicalHash !== runtimeHash) {
  console.error('Rule book freshness check failed: canonical and runtime hashes differ')
  process.exit(1)
}

console.log(`Rule book fresh and runtime synced: ${canonicalHash}`)
