import { proxyThalloJson } from '../_lib/thalloProxy.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }
  return proxyThalloJson(req, res, '/api/readonly/patients')
}
