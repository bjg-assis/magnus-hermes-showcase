import { proxyFinanceJson } from '../_lib/financeProxy.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }
  return proxyFinanceJson(req, res, 'regular-expenses')
}
