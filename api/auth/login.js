import { createSessionCookie, isAuthConfigured, sessionCookieHeader, verifyCredentials } from '../_lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  if (!isAuthConfigured()) {
    return res.status(503).json({ ok: false, error: 'portal_auth_not_configured' })
  }

  const { username, password } = req.body ?? {}
  if (!verifyCredentials(username, password)) {
    return res.status(401).json({ ok: false, error: 'invalid_credentials' })
  }

  res.setHeader('Set-Cookie', sessionCookieHeader(createSessionCookie()))
  return res.status(200).json({ ok: true })
}
