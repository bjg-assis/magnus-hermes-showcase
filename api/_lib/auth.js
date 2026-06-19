import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const BUILT_IN_USERNAME = 'bjgl'
const BUILT_IN_PASS_HASH = '2eeceb4ee583eb0e6699107ae667f605f2b9044c622c7ab392846cf3542f933f'
const COOKIE_NAME = 'mp_session'
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60

function isProductionRuntime() {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
}

function sessionSecret() {
  const secret = String(process.env.PORTAL_SESSION_SECRET ?? '').trim()
  if (secret) return secret
  return isProductionRuntime() ? '' : BUILT_IN_PASS_HASH
}

function portalUsername() {
  const configured = String(process.env.PORTAL_USERNAME ?? process.env.VITE_PORTAL_USERNAME ?? '').trim()
  if (configured) return configured
  return isProductionRuntime() ? '' : BUILT_IN_USERNAME
}

function portalPassHash() {
  const configured = String(process.env.PORTAL_PASS_HASH ?? process.env.VITE_PORTAL_PASS_HASH ?? '').trim().toLowerCase()
  if (configured) return configured
  return isProductionRuntime() ? '' : BUILT_IN_PASS_HASH
}

function sha256Hex(input) {
  return createHash('sha256').update(input).digest('hex')
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a), 'utf8')
  const right = Buffer.from(String(b), 'utf8')
  return left.length === right.length && timingSafeEqual(left, right)
}

function sign(payload) {
  const secret = sessionSecret()
  if (!secret) return ''
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function isAuthConfigured() {
  return sessionSecret().length > 0 && portalUsername().length > 0 && portalPassHash().length > 0
}

export function verifyCredentials(username, password) {
  if (!isAuthConfigured()) return false
  const userOk = safeEqual(String(username ?? '').trim(), portalUsername())
  const hashOk = safeEqual(sha256Hex(String(password ?? '')), portalPassHash())
  return userOk && hashOk
}

export function createSessionCookie() {
  if (!isAuthConfigured()) throw new Error('portal_auth_not_configured')
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = Buffer.from(JSON.stringify({ sub: 'portal', exp: expiresAt }), 'utf8').toString('base64url')
  return `${payload}.${sign(payload)}`
}

function parseCookies(header) {
  return Object.fromEntries(
    String(header ?? '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const idx = part.indexOf('=')
        return idx === -1 ? [part, ''] : [part.slice(0, idx), decodeURIComponent(part.slice(idx + 1))]
      }),
  )
}

export function isAuthenticated(req) {
  if (!isAuthConfigured()) return false
  const value = parseCookies(req.headers.cookie)[COOKIE_NAME]
  if (!value || !value.includes('.')) return false
  const [payload, signature] = value.split('.', 2)
  if (!safeEqual(sign(payload), signature)) return false
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return session.sub === 'portal' && Number(session.exp) > Date.now()
  } catch {
    return false
  }
}

function cookieSecurityAttribute() {
  return isProductionRuntime() ? '; Secure' : ''
}

export function sessionCookieHeader(value) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly${cookieSecurityAttribute()}; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`
}

export function clearSessionCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly${cookieSecurityAttribute()}; SameSite=Lax; Max-Age=0`
}
