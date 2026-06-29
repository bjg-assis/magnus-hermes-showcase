import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isAuthenticated } from '../_lib/auth.js'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(here, '../_data/thallo')
const markdownPath = resolve(dataDir, 'organisation-rulebook.md')
const pdfPath = resolve(dataDir, 'organisation-rulebook.pdf')

function readMarkdown() {
  return readFileSync(markdownPath, 'utf8')
}

function metadataFromMarkdown(text) {
  return {
    version: text.match(/^rulebook_version:\s*(.+)$/m)?.[1]?.trim() ?? 'Unknown',
    updated: text.match(/^last_updated:\s*(.+)$/m)?.[1]?.trim() ?? 'Unknown',
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: 'not_authenticated' })
  }

  const format = String(req.query?.format ?? 'metadata').toLowerCase()

  if (format === 'metadata') {
    return res.status(200).json({ ok: true, ...metadataFromMarkdown(readMarkdown()) })
  }

  if (format === 'markdown') {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    res.setHeader('Content-Disposition', 'inline; filename="thallo-organisation-rulebook.md"')
    return res.status(200).send(readMarkdown())
  }

  if (format === 'pdf') {
    const pdf = readFileSync(pdfPath)
    const disposition = req.query?.download === '1' ? 'attachment' : 'inline'
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `${disposition}; filename="thallo-organisation-rulebook.pdf"`)
    return res.status(200).send(pdf)
  }

  return res.status(400).json({ ok: false, error: 'unsupported_rulebook_format' })
}
