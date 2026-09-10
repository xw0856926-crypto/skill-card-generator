import { analyzePersonalBrand } from '../../server/analyzeCore.js'

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(payload),
  }
}

function getHttpMethod(event = {}) {
  return (
    event.httpMethod ||
    event.requestContext?.httpMethod ||
    event.method ||
    'POST'
  ).toUpperCase()
}

function parseBody(event = {}) {
  let body = event.body

  if (event.isBase64Encoded && typeof body === 'string') {
    body = Buffer.from(body, 'base64').toString('utf8')
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body || '{}')
    } catch {
      return {}
    }
  }

  if (body && typeof body === 'object') {
    return body
  }

  if (event.name || event.identity || event.interests) {
    return event
  }

  return {}
}

export async function main(event = {}, _context) {
  const method = getHttpMethod(event)

  if (method === 'OPTIONS') {
    return jsonResponse(204, {})
  }

  if (method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  try {
    const { name, identity, interests, strengths, experience } = parseBody(event)
    const result = await analyzePersonalBrand({
      name,
      identity,
      interests,
      strengths,
      experience,
    })
    return jsonResponse(200, result)
  } catch (error) {
    console.error('Analyze error:', error)
    return jsonResponse(error.status || 500, {
      error: error.message || 'AI 分析失败，请稍后重试',
    })
  }
}

export default main
