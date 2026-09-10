function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <p className="site-header__eyebrow">AI × 个人品牌</p>
        <h1 className="site-header__title">
          把零散的经历，
          <br />
          变成清晰的<span className="site-header__emphasis">个人表达</span>
        </h1>
        <p className="site-header__subtitle">
          输入少量信息，AI 将帮你提炼个人定位、技能标签与自我介绍，并生成一张属于你的个人名片。
        </p>
      </div>
      <p className="site-header__decor" aria-hidden="true">
        Better People
        <br />
        Brighter Opportunities.
      </p>
    </header>
  )
}

export default Header
