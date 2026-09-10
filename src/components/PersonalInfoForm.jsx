import { readFileAsDataUrl } from '../utils/helpers'

function PersonalInfoForm({ formData, onChange, onAnalyze, isAnalyzing, analyzeError }) {
  const handleInputChange = (field) => (event) => {
    onChange({ ...formData, [field]: event.target.value })
  }

  const handleClear = (field) => () => {
    onChange({ ...formData, [field]: '' })
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    onChange({ ...formData, avatar: dataUrl })
  }

  const handleAvatarRemove = () => {
    onChange({ ...formData, avatar: null })
  }

  const handleAnalyzeClick = () => {
    if (typeof onAnalyze === 'function') {
      onAnalyze(formData)
    }
  }

  return (
    <section className="panel personal-form">
      <h2 className="panel__title">你的信息</h2>
      <p className="panel__desc">介绍一下你自己。用几条简单信息，生成属于你的个人定位、技能标签与个人介绍。</p>

      <div className="form-group">
        <label htmlFor="name">
          姓名{!String(formData.name || '').trim() && <span className="form-required"> *</span>}
        </label>
        <div className="input-shell">
          <input
            id="name"
            type="text"
            placeholder="例如：张小雅"
            value={formData.name}
            onChange={handleInputChange('name')}
          />
          {formData.name ? (
            <button type="button" className="input-shell__clear" onClick={handleClear('name')} aria-label="清除姓名">
              ×
            </button>
          ) : null}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="role">
          目前身份{!String(formData.role || '').trim() && <span className="form-required"> *</span>}
        </label>
        <div className="input-shell">
          <input
            id="role"
            type="text"
            placeholder="例如：数字媒体硕士毕业生 / UX设计师 / 自由插画师"
            value={formData.role}
            onChange={handleInputChange('role')}
          />
          {formData.role ? (
            <button type="button" className="input-shell__clear" onClick={handleClear('role')} aria-label="清除身份">
              ×
            </button>
          ) : null}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="interests">感兴趣的方向</label>
        <div className="input-shell">
          <input
            id="interests"
            type="text"
            placeholder="例如：AI产品、用户体验、游戏设计"
            value={formData.interests}
            onChange={handleInputChange('interests')}
          />
          {formData.interests ? (
            <button
              type="button"
              className="input-shell__clear"
              onClick={handleClear('interests')}
              aria-label="清除兴趣方向"
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="strengths">我擅长什么</label>
        <div className="input-shell input-shell--textarea">
          <textarea
            id="strengths"
            rows={3}
            placeholder="例如：用户研究、Figma、视觉设计、Unity、AI辅助开发"
            value={formData.strengths}
            onChange={handleInputChange('strengths')}
          />
          <span className="char-count">{formData.strengths.length}/200</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="experience">简单说说你的经历</label>
        <div className="input-shell input-shell--textarea">
          <textarea
            id="experience"
            rows={4}
            placeholder="例如：做过情绪缓解APP、AR项目和叙事游戏，希望寻找AI产品或UX相关工作"
            value={formData.experience}
            onChange={handleInputChange('experience')}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="avatar">头像上传</label>
        <div className="avatar-upload">
          {formData.avatar ? (
            <div className="avatar-upload__preview">
              <img src={formData.avatar} alt="头像预览" />
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={handleAvatarRemove}
              >
                移除头像
              </button>
            </div>
          ) : (
            <label className="file-input-label" htmlFor="avatar">
              选择图片
            </label>
          )}
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="file-input"
          />
        </div>
      </div>

      <button
        type="button"
        className="btn btn--primary btn--analyze"
        onClick={handleAnalyzeClick}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? '✨ AI 正在帮你整理…' : '✨ AI 帮我提炼'}
        {!isAnalyzing && <span className="btn__arrow" aria-hidden="true">→</span>}
      </button>
      {analyzeError && <p className="form-error">{analyzeError}</p>}

      <p className="form-privacy">
        <span className="form-privacy__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        你的信息仅用于生成个人名片，不会被保存。
      </p>
    </section>
  )
}

export default PersonalInfoForm
