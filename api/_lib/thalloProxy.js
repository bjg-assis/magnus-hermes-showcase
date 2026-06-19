import { isAuthenticated } from '../_lib/auth.js'

function upstreamBase() {
  return String(process.env.THALLO_API_BASE ?? '').replace(/\/$/, '')
}

function readonlyToken() {
  return String(process.env.THALLO_PROXY_TOKEN ?? process.env.READONLY_API_TOKEN ?? '')
}

export async function proxyThalloJson(req, res, path) {
  res.setHeader('Cache-Control', 'no-store')

  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: 'not_authenticated' })
  }

  const base = upstreamBase()
  const token = readonlyToken()
  if (!base || !token) {
    return res.status(503).json({ ok: false, error: 'thallo_proxy_not_configured' })
  }

  const url = new URL(`${base}${path}`)
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (value === undefined || key === 'id') continue
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item))
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  const upstream = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'User-Agent': 'Magnus-Thallo-ReadOnly-Proxy/1.0',
    },
  })

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json; charset=utf-8')
  return res.send(body)
}
