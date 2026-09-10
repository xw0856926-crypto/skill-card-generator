import { analyzePersonalBrand } from '../server/analyzeCore.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { name, identity, interests, strengths, experience } = body
    const result = await analyzePersonalBrand({
      name,
      identity,
      interests,
      strengths,
      experience,
    })
    res.status(200).json(result)
  } catch (error) {
    console.error('Analyze error:', error)
    const status = error.status || 500
    res.status(status).json({
      error: error.message || 'AI 分析失败，请稍后重试',
    })
  }
}

export const config = {
  maxDuration: 60,
}
