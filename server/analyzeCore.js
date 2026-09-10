const DEEPSEEK_API_KEY =
  process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY || ''
const DEEPSEEK_BASE_URL = (
  process.env.DEEPSEEK_BASE_URL ||
  process.env.AI_BASE_URL ||
  'https://api.deepseek.com'
).replace(/\/$/, '')
const DEEPSEEK_MODEL =
  process.env.DEEPSEEK_MODEL || process.env.AI_MODEL || 'deepseek-v4-flash'

const SYSTEM_PROMPT = `你是帮助年轻学生、创作者、自由职业者和求职者提炼个人定位与个人品牌表达的助手。
你的任务不是复述用户原文，而是把有限信息提炼成适合个人名片的表达。

必须只输出一个合法 JSON 对象，字段严格为：
{"positioning":"string","skills":["string"],"bio":"string"}

禁止输出 Markdown、代码围栏（如 \`\`\`json）、注释或任何解释文字。

【positioning】
- 控制在约 10～20 个中文字符；若含英文工具名，整体仍保持一行短标签
- 优先使用「方向 × 能力 × 场景」或同样简洁的并列结构
- 不要写完整句子，不要句号
- 不要出现「我是」「一名」「一个」「我叫」
- 不要出现用户姓名
- 示例：「宠物摄影 × 品牌内容 × 视觉创作」「AI产品 × 用户研究 × 快速原型」

【skills】
- 返回 4～6 个标签
- 优先提炼用户真实输入中的核心能力，可做合理归纳，但不得杜撰未体现的专业能力
- 每个标签尽量短：不超过约 8 个中文字符，或简短英文词组（如 Figma、UX Design）
- 避免同义重复，如不要同时出现「摄影」和「摄影拍摄」
- 中英文混合时，保留用户常用术语，不要强制全部翻译

【bio】
- 控制在约 70～110 个中文字符
- 不要出现用户姓名
- 不要以「我是」「一名」「一个」「我叫」开头
- 不要重复身份字段里已经明确的头衔/身份表述
- 不要机械复述用户输入；将经历、能力和目标重组为自然、专业、适合名片的短介绍
- 语气简洁、自信，不夸大
- 不要编造项目、奖项、客户或工作经历
- 尽量突出：核心能力 + 实践背景 + 关注方向/价值
- 中文介绍可保留常见工具英文名，如 Figma、Unity、Lightroom

【风格】
- 面向学生、创作者、自由职业者和求职者
- 不要过度企业化、空泛或夸张
- 禁止使用未经输入支持的词：拥有卓越能力、极具创新精神、行业领先、资深、专家、赋能、沉淀、闭环 等

【信息不足时】
- 宁可更保守、更短，也不要为填满而编造`

function buildUserPrompt(payload) {
  return `请根据以下信息提炼个人品牌名片内容（定位 / 技能 / 介绍），不要复述原文，不要使用姓名：
目前身份：${payload.identity || '未填写'}
感兴趣的方向：${payload.interests || '未填写'}
我擅长什么：${payload.strengths || '未填写'}
简单经历：${payload.experience || '未填写'}

只返回 JSON。`
}

function extractJson(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('empty model output')
  }

  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1].trim() : trimmed
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('no json object')
  }

  return JSON.parse(raw.slice(start, end + 1))
}

function countCjk(text) {
  return (String(text).match(/[\u4e00-\u9fff]/g) || []).length
}

function stripName(text, name) {
  const source = String(text || '')
  const trimmedName = String(name || '').trim()
  if (!trimmedName) return source.trim()
  return source.split(trimmedName).join('').replace(/\s{2,}/g, ' ').trim()
}

function stripIdentityEcho(text, identity) {
  const source = String(text || '').trim()
  const trimmedIdentity = String(identity || '').trim()
  if (!trimmedIdentity || trimmedIdentity.length < 2) return source
  return source.split(trimmedIdentity).join('').replace(/\s{2,}/g, ' ').trim()
}

function stripOpeners(text) {
  return String(text || '')
    .replace(/^(我是|我叫|一名|一个|一位)+/g, '')
    .replace(/^[，,、\s]+/, '')
    .trim()
}

function trimCjk(text, maxCjk) {
  const source = String(text || '').trim()
  if (countCjk(source) <= maxCjk) return source

  let cjk = 0
  let output = ''
  for (const char of source) {
    if (/[\u4e00-\u9fff]/.test(char)) cjk += 1
    if (cjk > maxCjk) break
    output += char
  }
  return output.replace(/[，,。；;、\s]+$/g, '').trim()
}

function skillKey(skill) {
  return String(skill).toLowerCase().replace(/\s+/g, '')
}

function limitSkillLabel(skill) {
  const source = String(skill || '').trim()
  if (!source) return ''
  if (countCjk(source) > 8) return trimCjk(source, 8)
  if (source.length > 18) return source.slice(0, 18).trim()
  return source
}

function dedupeSkills(skills) {
  const result = []

  skills.forEach((skill) => {
    const key = skillKey(skill)
    if (!key) return

    const duplicateIndex = result.findIndex((existing) => {
      const existingKey = skillKey(existing)
      return (
        existingKey === key ||
        existingKey.includes(key) ||
        key.includes(existingKey)
      )
    })

    if (duplicateIndex === -1) {
      result.push(skill)
      return
    }

    if (skill.length < result[duplicateIndex].length) {
      result[duplicateIndex] = skill
    }
  })

  return result
}

function normalizeAnalysis(parsed, payload = {}) {
  const source = parsed && typeof parsed === 'object' ? parsed : {}

  let skills = source.skills
  if (typeof skills === 'string') {
    skills = skills.split(/[,，、|/]/)
  }
  if (!Array.isArray(skills)) {
    skills = []
  }

  skills = dedupeSkills(
    skills
      .map((item) => limitSkillLabel(item))
      .filter(Boolean)
  ).slice(0, 6)

  let positioning = stripOpeners(stripName(source.positioning, payload.name))
  positioning = positioning
    .replace(/[。！？.!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (countCjk(positioning) > 22) {
    positioning = trimCjk(positioning, 20)
  }
  positioning = positioning || '创作实践 × 个人表达'

  let bio = stripOpeners(
    stripIdentityEcho(stripName(source.bio || source.introduction, payload.name), payload.identity)
  )
  if (countCjk(bio) > 110) {
    bio = trimCjk(bio, 110)
  }
  bio = bio || '正在持续学习与实践，希望把已有能力用在真实项目中，和他人一起把想法落地。'

  return { positioning, skills, bio }
}

export async function analyzePersonalBrand(payload) {
  if (!DEEPSEEK_API_KEY) {
    const error = new Error('缺少 DEEPSEEK_API_KEY')
    error.status = 500
    throw error
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 55000)

  let response
  try {
    response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        temperature: 0.4,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(payload) },
        ],
      }),
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('AI 请求超时，请稍后重试')
      timeoutError.status = 504
      throw timeoutError
    }
    const networkError = new Error('无法连接 AI 服务，请稍后重试')
    networkError.status = 502
    throw networkError
  } finally {
    clearTimeout(timeout)
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = body?.error?.message || `AI 请求失败（${response.status}）`
    const error = new Error(message)
    error.status = 502
    throw error
  }

  const content = body?.choices?.[0]?.message?.content
  try {
    return normalizeAnalysis(extractJson(content), payload)
  } catch {
    return normalizeAnalysis({}, payload)
  }
}
