import { isAuthenticated } from './auth.js'

const ALLOWED_PATHS = new Map([
  ['summary', '/api/finance/summary'],
  ['cash-flow', '/api/finance/cash-flow'],
  ['regular-expenses', '/api/finance/regular-expenses'],
  ['review-queue', '/api/finance/review-queue'],
  ['balance-sheet', '/api/finance/balance-sheet'],
  ['wealth-plan', '/api/finance/wealth-plan'],
  ['source-freshness', '/api/finance/audit/source-freshness'],
])

function upstreamBase() {
  return String(process.env.STERLING_FINANCE_API_BASE ?? '').replace(/\/$/, '')
}

function proxyToken() {
  return String(process.env.STERLING_FINANCE_PROXY_TOKEN ?? '')
}

export function financeProxyConfigured() {
  return upstreamBase().length > 0 && proxyToken().length > 0
}

export async function proxyFinanceJson(req, res, key) {
  res.setHeader('Cache-Control', 'no-store')

  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: 'not_authenticated' })
  }

  const path = ALLOWED_PATHS.get(key)
  if (!path) return res.status(404).json({ ok: false, error: 'unknown_finance_endpoint' })

  const base = upstreamBase()
  const token = proxyToken()
  if (!base || !token) {
    return res.status(503).json({ ok: false, error: 'finance_proxy_not_configured' })
  }

  const url = new URL(`${base}${path}`)
  for (const [queryKey, value] of Object.entries(req.query ?? {})) {
    if (queryKey === 'endpoint') continue
    if (value === undefined) continue
    if (Array.isArray(value)) value.forEach((item) => url.searchParams.append(queryKey, String(item)))
    else url.searchParams.set(queryKey, String(value))
  }

  const upstream = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'User-Agent': 'Magnus-Sterling-Finance-Proxy/1.0',
    },
  })

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json; charset=utf-8')
  return res.send(body)
}
