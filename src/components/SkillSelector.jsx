import { SKILL_CATEGORIES } from '../data/skills'
import { toggleSkillId } from '../utils/helpers'

function SkillSelector({ selectedSkillIds, onChange }) {
  const handleSkillClick = (skillId) => {
    onChange(toggleSkillId(selectedSkillIds, skillId))
  }

  return (
    <section className="panel skill-selector">
      <h2 className="panel__title">探索你可以帮助别人的技能</h2>
      <p className="panel__desc">
        选择你已经掌握、并可能帮助他人的技能。它们会自动显示在你的技能卡和详情页中。
      </p>

      {selectedSkillIds.length > 0 && (
        <p className="skill-selector__count">
          已选择 {selectedSkillIds.length} 项技能
        </p>
      )}

      {SKILL_CATEGORIES.map((category) => (
        <div key={category.id} className="skill-category">
          <h3 className="skill-category__title">{category.name}</h3>
          <div className="skill-tags">
            {category.skills.map((skill) => {
              const isSelected = selectedSkillIds.includes(skill.id)
              return (
                <button
                  key={skill.id}
                  type="button"
                  className={`skill-tag ${isSelected ? 'skill-tag--selected' : ''}`}
                  onClick={() => handleSkillClick(skill.id)}
                  title={skill.helpText}
                >
                  {skill.skillName}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

export default SkillSelector
