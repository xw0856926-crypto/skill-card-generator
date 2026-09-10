import { forwardRef } from 'react'
import { MAX_GENERATED_CARD_SKILLS } from '../data/skills'

function takeCjk(text, max) {
  let count = 0
  let output = ''
  for (const char of String(text || '')) {
    if (/[\u4e00-\u9fff]/.test(char)) count += 1
    output += char
    if (count >= max) break
  }
  return output.trim()
}

function splitHeadline(text) {
  const clean = String(text || '')
    .replace(/[。！？.!?]+$/g, '')
    .trim()
  if (!clean) return []

  const chars = [...clean]
  if (chars.length <= 9) return [clean]

  const limit = Math.min(chars.length, 18)
  const mid = Math.ceil(limit / 2)
  let splitAt = mid
  for (let index = mid - 2; index <= mid + 2 && index < limit; index += 1) {
    if (chars[index] === ' ' || chars[index] === '，' || chars[index] === '、') {
      splitAt = index
      break
    }
  }

  const first = chars.slice(0, splitAt).join('').trim()
  const second = chars.slice(splitAt, splitAt + 10).join('').trim()
  return second ? [first, second] : [first]
}

function getHeadlineLines(data, placeholders) {
  const explicit = [data.headline, data.slogan, data.title].find((value) =>
    String(value || '').trim()
  )
  if (explicit) return splitHeadline(explicit)

  const introduction = String(data.introduction || '').trim()
  const isPlaceholder =
    Boolean(placeholders?.introduction) &&
    (!introduction || introduction === placeholders.introduction)

  if (introduction && !isPlaceholder) {
    const firstSentence = introduction.split(/[。！？；;\n]/)[0]
    return splitHeadline(takeCjk(firstSentence.replace(/[，,]/g, ''), 16))
  }

  return ['你的品牌主张', '将显示在这里']
}

function getQuote(data, placeholders) {
  const explicit = String(data.quote || data.tagline || '').trim()
  if (explicit) return explicit

  const introduction = String(data.introduction || '').trim()
  if (!introduction || introduction === placeholders?.introduction) return ''

  const snippet = takeCjk(introduction.split(/[。！？]/)[0], 18)
  return snippet.length >= 8 ? snippet : ''
}

const CardContent = forwardRef(function CardContent({ data, placeholders }, ref) {
  const skills = (data.skills || []).slice(0, Math.max(MAX_GENERATED_CARD_SKILLS, 6))
  const headlineLines = getHeadlineLines(data, placeholders)
  const quote = getQuote(data, placeholders)
  const location = String(data.location || data.city || '').trim()
  const positioning = data.positioning || placeholders?.positioning || '个人定位'
  const introduction = data.introduction || placeholders?.introduction || '自我介绍'
  const isHeadlineMuted = !(data.headline || data.slogan || data.title || data.introduction)
  const isPositioningMuted = !data.positioning
  const isIntroductionMuted = !data.introduction

  return (
    <div ref={ref} className="card-content">
      <div className="card-content__decor" aria-hidden="true">
        <span className="card-content__blob card-content__blob--lg" />
        <span className="card-content__blob card-content__blob--md" />
        <span className="card-content__shape" />
      </div>
      <p className="card-content__watermark" aria-hidden="true">
        EXPLORE
        <br />
        DESIGN
        <br />
        A KINDER DIGITAL WORLD.
      </p>

      <div className="card-content__identity">
        <div className="card-content__profile">
          <div className="card-content__avatar-wrap">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={data.name || '头像'}
                className="card-content__avatar"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="card-content__avatar card-content__avatar--placeholder">
                {data.name ? data.name.charAt(0) : '?'}
              </div>
            )}
          </div>
          <h3 className="card-content__name">{data.name || '你的姓名'}</h3>
          <p className="card-content__role">{data.role || '目前身份'}</p>
          {location ? (
            <p className="card-content__location">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 22s7-7.2 7-12.2A7 7 0 0 0 5 9.8C5 14.8 12 22 12 22Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="9.8" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {location}
            </p>
          ) : null}
        </div>
        {quote ? <p className="card-content__quote">「{quote}」</p> : null}
      </div>

      <div className="card-content__main">
        <h4 className={`card-content__headline ${isHeadlineMuted ? 'is-muted' : ''}`}>
          {headlineLines.map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </h4>
        <p className={`card-content__positioning ${isPositioningMuted ? 'is-muted' : ''}`}>
          {positioning}
        </p>
        <div className="card-content__rule" />

        <div className="card-content__block">
          <p className="card-content__label">技能标签</p>
          <div className="card-content__skill-tags">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span key={skill.id} className="card-content__skill-tag">
                  {skill.skillName}
                </span>
              ))
            ) : (
              <span className="card-content__skill-tag card-content__skill-tag--empty">
                {placeholders?.skills || '选择技能标签'}
              </span>
            )}
          </div>
        </div>

        <div className="card-content__block">
          <p className="card-content__label">关于我</p>
          <p className={`card-content__introduction ${isIntroductionMuted ? 'is-muted' : ''}`}>
            {introduction}
          </p>
        </div>
      </div>
    </div>
  )
})

export default CardContent
