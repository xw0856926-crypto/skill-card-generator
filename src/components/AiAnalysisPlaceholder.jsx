function AiAnalysisPlaceholder({ isAnalyzing }) {
  return (
    <section className="panel ai-analysis ai-analysis-placeholder">
      <p className="panel__kicker">第二步</p>
      <div className="ai-analysis__badge">等待你的信息</div>
      <h2 className="panel__title">AI 帮你提炼</h2>
      <div className={`ai-analysis-placeholder__hint ${isAnalyzing ? 'is-loading' : ''}`}>
        {isAnalyzing
          ? '✦ AI 正在帮你整理…'
          : '填写左侧信息后，点击「✦ AI 帮我提炼」，这里会给出可修改的定位、技能与介绍。'}
      </div>
    </section>
  )
}

export default AiAnalysisPlaceholder
