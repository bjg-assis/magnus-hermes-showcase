import { proxyThalloJson } from '../_lib/thalloProxy.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const id = Number(req.query?.id)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ ok: false, error: 'invalid_patient_id' })
  }

  return proxyThalloJson(req, res, `/api/readonly/patients/${id}`)
}
