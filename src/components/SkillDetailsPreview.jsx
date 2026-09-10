function SkillDetailsPreview({ formData, selectedSkills }) {
  const hasSkills = selectedSkills.length > 0

  return (
    <section className="skill-details-preview">
      <div className="skill-details-preview__inner">
        <h2 className="skill-details-preview__title">技能详情预览</h2>
        <p className="skill-details-preview__subtitle">
          扫码后可看到的详细内容预览（第一版为本地展示，暂不生成在线页面）
        </p>

        <div className="skill-details-preview__content">
          <div className="skill-details-preview__header">
            {formData.avatar && (
              <img
                src={formData.avatar}
                alt={formData.name || '头像'}
                className="skill-details-preview__avatar"
              />
            )}
            <div>
              <h3 className="skill-details-preview__name">
                {formData.name || '你的姓名'}
              </h3>
              <p className="skill-details-preview__role">
                {formData.role || '身份 / 职业方向'}
              </p>
            </div>
          </div>

          <p className="skill-details-preview__tagline">
            {formData.tagline || '一句话介绍'}
          </p>

          <div className="skill-details-preview__section">
            <h4 className="skill-details-preview__section-title">我可以帮助你：</h4>
            {hasSkills ? (
              <ul className="skill-details-preview__list">
                {selectedSkills.map((skill) => (
                  <li key={skill.id} className="skill-details-preview__item">
                    <span className="skill-details-preview__skill-name">
                      {skill.skillName}
                    </span>
                    <span className="skill-details-preview__help-text">
                      {skill.helpText}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="skill-details-preview__empty">
                选择一些技能后，这里会展示你可以怎样帮助别人。
              </p>
            )}
          </div>

          <div className="skill-details-preview__contact">
            <h4 className="skill-details-preview__section-title">联系方式</h4>
            <div className="skill-details-preview__contact-list">
              {formData.email && <span>{formData.email}</span>}
              {formData.phone && <span>{formData.phone}</span>}
              {formData.portfolioUrl && <span>{formData.portfolioUrl}</span>}
              {formData.socialMedia && <span>{formData.socialMedia}</span>}
              {!formData.email &&
                !formData.phone &&
                !formData.portfolioUrl &&
                !formData.socialMedia && (
                  <span className="skill-details-preview__contact-empty">
                    填写联系方式后会显示在这里
                  </span>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkillDetailsPreview
