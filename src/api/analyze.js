function slugifySkill(name, index) {
  const safe = String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '')

  return `ai-${index}-${safe || 'skill'}`
}

export function analysisFromApiResult(result) {
  const skills = Array.isArray(result?.skills)
    ? result.skills
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .map((skillName, index) => ({
          id: slugifySkill(skillName, index),
          skillName,
        }))
    : []

  return {
    positioning: String(result?.positioning || '').trim() || '创意实践者',
    introduction:
      String(result?.bio || result?.introduction || '').trim() ||
      '正在持续学习与实践，希望用自己的能力帮助他人把想法落地。',
    skills,
    selectedSkillIds: skills.map((skill) => skill.id),
  }
}

export async function requestAiAnalysis(formData) {
  const endpoint = '/api/analyze'
  let response

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        identity: formData.role,
        interests: formData.interests,
        strengths: formData.strengths,
        experience: formData.experience,
      }),
    })
  } catch (error) {
    console.error('AI analysis failed:', error)
    console.error('API endpoint:', endpoint)
    throw error
  }

  const rawBody = await response.text()
  let payload = {}

  try {
    payload = rawBody ? JSON.parse(rawBody) : {}
  } catch (error) {
    console.error('AI analysis failed:', error)
    console.error('HTTP status:', response.status)
    console.error('response body:', rawBody)
    console.error('API endpoint:', endpoint)
    throw new Error('AI 分析失败，请稍后重试')
  }

  if (!response.ok) {
    console.error('AI analysis failed:', payload.error || `HTTP ${response.status}`)
    console.error('HTTP status:', response.status)
    console.error('response body:', rawBody)
    console.error('API endpoint:', endpoint)
    throw new Error(payload.error || 'AI 分析失败，请稍后重试')
  }

  return analysisFromApiResult(payload)
}
