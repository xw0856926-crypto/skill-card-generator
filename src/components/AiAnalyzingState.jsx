const PROGRESS_ITEMS = [
  '正在识别你的个人定位',
  '正在整理核心技能',
  '正在生成个人介绍',
]

function AiAnalyzingState() {
  return (
    <section className="panel ai-analyzing" aria-live="polite" aria-busy="true">
      <h2 className="panel__title">你的信息</h2>
      <p className="ai-analyzing__status">
        <span className="ai-analyzing__spark" aria-hidden="true">✨</span>
        AI 正在理解你的信息
        <span className="ai-analyzing__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </p>
      <ul className="ai-analyzing__list">
        {PROGRESS_ITEMS.map((item) => (
          <li key={item} className="ai-analyzing__item">
            <span className="ai-analyzing__check" aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AiAnalyzingState
