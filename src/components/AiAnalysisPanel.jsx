import { useState } from 'react'

function AiAnalysisPanel({ analysis, onChange, onGenerateCard, isCardGenerated, onBackToInput }) {
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [editing, setEditing] = useState({
    positioning: false,
    skills: false,
    introduction: false,
  })

  const handlePositioningChange = (event) => {
    onChange({ ...analysis, positioning: event.target.value })
  }

  const handleIntroductionChange = (event) => {
    onChange({ ...analysis, introduction: event.target.value })
  }

  const handleToggleSkill = (skillId) => {
    const selectedIds = analysis.selectedSkillIds.includes(skillId)
      ? analysis.selectedSkillIds.filter((id) => id !== skillId)
      : [...analysis.selectedSkillIds, skillId]
    onChange({ ...analysis, selectedSkillIds: selectedIds })
  }

  const handleStartAddSkill = () => {
    setIsAddingSkill(true)
  }

  const handleAddSkill = () => {
    const skillName = newSkillName.trim()
    if (!skillName) return

    const alreadyExists = analysis.skills.some(
      (skill) => skill.skillName.toLowerCase() === skillName.toLowerCase()
    )
    if (alreadyExists) {
      setNewSkillName('')
      setIsAddingSkill(false)
      return
    }

    const newSkill = {
      id: `custom-${Date.now()}`,
      skillName,
    }

    onChange({
      ...analysis,
      skills: [...analysis.skills, newSkill],
      selectedSkillIds: [...analysis.selectedSkillIds, newSkill.id],
    })
    setNewSkillName('')
    setIsAddingSkill(false)
  }

  const handleCancelAddSkill = () => {
    setNewSkillName('')
    setIsAddingSkill(false)
  }

  const handleNewSkillKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddSkill()
    }
    if (event.key === 'Escape') {
      handleCancelAddSkill()
    }
  }

  const toggleEditing = (field) => {
    setEditing((current) => ({ ...current, [field]: !current[field] }))
  }

  return (
    <section className="panel ai-analysis">
      <div className="ai-analysis__top">
        <h2 className="panel__title">你的信息</h2>
        <span className="ai-analysis__badge">✦ AI 已整理</span>
      </div>
      <p className="panel__desc">确认或微调下面的内容，再生成你的个人名片。</p>

      <div className="ai-result">
        <div className="ai-result__head">
          <h3 className="ai-analysis__section-title">你的个人定位</h3>
          <button type="button" className="ai-result__edit" onClick={() => toggleEditing('positioning')}>
            {editing.positioning ? '完成' : '编辑'}
          </button>
        </div>
        {editing.positioning ? (
          <input
            id="ai-positioning"
            type="text"
            value={analysis.positioning}
            onChange={handlePositioningChange}
          />
        ) : (
          <p className="ai-result__quote">“{analysis.positioning || '尚未生成个人定位'}”</p>
        )}
      </div>

      <div className="ai-analysis__skills">
        <div className="ai-result__head">
          <h3 className="ai-analysis__section-title">核心技能</h3>
          <button type="button" className="ai-result__edit" onClick={() => toggleEditing('skills')}>
            {editing.skills ? '完成' : '编辑'}
          </button>
        </div>
        <div className="skill-tags">
          {analysis.skills.map((skill, index) => {
            const isSelected = analysis.selectedSkillIds.includes(skill.id)
            if (!editing.skills && !isSelected) return null
            return (
              <button
                key={skill.id}
                type="button"
                className={`skill-tag ${isSelected ? 'skill-tag--selected' : ''} ${editing.skills ? '' : 'skill-tag--static'}`}
                style={{ animationDelay: `${index * 60}ms` }}
                onClick={editing.skills ? () => handleToggleSkill(skill.id) : undefined}
                disabled={!editing.skills}
              >
                {skill.skillName}
              </button>
            )
          })}
        </div>

        {editing.skills ? (
          isAddingSkill ? (
            <div className="ai-analysis__add-row">
              <input
                type="text"
                className="ai-analysis__add-input"
                placeholder="输入新的技能名称"
                value={newSkillName}
                onChange={(event) => setNewSkillName(event.target.value)}
                onKeyDown={handleNewSkillKeyDown}
                autoFocus
              />
              <button type="button" className="btn btn--ghost btn--small" onClick={handleAddSkill}>
                添加
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={handleCancelAddSkill}>
                取消
              </button>
            </div>
          ) : (
            <button type="button" className="skill-tag skill-tag--add" onClick={handleStartAddSkill}>
              ＋ 添加技能
            </button>
          )
        ) : null}
      </div>

      <div className="ai-result">
        <div className="ai-result__head">
          <h3 className="ai-analysis__section-title">个人介绍</h3>
          <button type="button" className="ai-result__edit" onClick={() => toggleEditing('introduction')}>
            {editing.introduction ? '完成' : '编辑'}
          </button>
        </div>
        {editing.introduction ? (
          <textarea
            id="ai-introduction"
            rows={6}
            value={analysis.introduction}
            onChange={handleIntroductionChange}
          />
        ) : (
          <p className="ai-result__body">{analysis.introduction || '尚未生成个人介绍'}</p>
        )}
      </div>

      {!isCardGenerated && (
        <button type="button" className="btn btn--primary" onClick={onGenerateCard}>
          生成我的个人名片
          <span className="btn__arrow" aria-hidden="true">→</span>
        </button>
      )}
      {isCardGenerated && (
        <p className="ai-analysis__status">✓ 个人名片已生成，可在右侧下载</p>
      )}
      {typeof onBackToInput === 'function' && (
        <button type="button" className="btn-text" onClick={onBackToInput}>
          ← 返回修改信息
        </button>
      )}
    </section>
  )
}

export default AiAnalysisPanel
