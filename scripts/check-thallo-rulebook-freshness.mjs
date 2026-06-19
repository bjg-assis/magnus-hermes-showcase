#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const canonical = resolve(repoRoot, 'public/thallo/organisation-rulebook.md')
const runtime = '/Users/user/.hermes/thallo-org/organisation-rulebook.md'

function sha(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

if (!existsSync(canonical)) {
  console.error(`Missing canonical rule book: ${canonical}`)
  process.exit(1)
}

const canonicalHash = sha(canonical)

if (!existsSync(dirname(runtime))) {
  console.log(`Rule book canonical present: ${canonicalHash}`)
  console.log(`Runtime sync skipped outside local Hermes host: ${runtime}`)
  process.exit(0)
}

copyFileSync(canonical, runtime)
const runtimeHash = sha(runtime)

if (canonicalHash !== runtimeHash) {
  console.error('Rule book freshness check failed: canonical and runtime hashes differ')
  console.error(`canonical ${canonicalHash} ${canonical}`)
  console.error(`runtime   ${runtimeHash} ${runtime}`)
  process.exit(1)
}

console.log(`Rule book fresh: ${canonicalHash}`)
