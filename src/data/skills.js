export const SKILL_CATEGORIES = [
  {
    id: 'design',
    name: 'Design 设计类',
    skills: [
      { id: 'ui-design', skillName: 'UI 设计', helpText: '我可以帮助别人设计清晰好看的界面。' },
      { id: 'poster-design', skillName: '海报设计', helpText: '我可以帮助别人制作活动海报或社交媒体视觉图。' },
      { id: 'portfolio-layout', skillName: '作品集排版', helpText: '我可以帮助别人整理作品集结构和视觉呈现。' },
      { id: 'brand-visual', skillName: '品牌视觉', helpText: '我可以帮助小项目建立基础视觉风格。' },
      { id: 'illustration', skillName: '插画', helpText: '我可以为内容、活动或个人项目绘制插图。' },
    ],
  },
  {
    id: 'tech',
    name: 'Tech 技术类',
    skills: [
      { id: 'web-dev', skillName: '网页制作', helpText: '我可以帮助别人制作简单的个人网页或作品展示页。' },
      { id: 'unity-prototype', skillName: 'Unity 原型', helpText: '我可以帮助别人搭建简单的互动原型或 2D 游戏流程。' },
      { id: 'figma-prototype', skillName: 'Figma 原型', helpText: '我可以帮助别人制作 App 或网页交互原型。' },
      { id: 'html-css', skillName: 'HTML/CSS', helpText: '我可以帮助别人调整网页布局和视觉样式。' },
      { id: 'data-organize', skillName: '数据整理', helpText: '我可以帮助别人整理表格、问卷或基础数据。' },
    ],
  },
  {
    id: 'content',
    name: 'Content 内容类',
    skills: [
      { id: 'copywriting', skillName: '文案润色', helpText: '我可以帮助别人优化介绍文字、项目说明或社交媒体文案。' },
      { id: 'translation', skillName: '中英翻译', helpText: '我可以帮助别人翻译或润色中英文内容。' },
      { id: 'ppt-optimize', skillName: 'PPT 优化', helpText: '我可以帮助别人优化演示文稿结构和视觉效果。' },
      { id: 'resume-organize', skillName: '简历整理', helpText: '我可以帮助别人整理简历内容和表达重点。' },
      { id: 'project-intro', skillName: '项目介绍', helpText: '我可以帮助别人把项目经历讲得更清楚。' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative 创作类',
    skills: [
      { id: 'video-editing', skillName: '视频剪辑', helpText: '我可以帮助别人剪辑短视频、作品展示 reel 或活动记录。' },
      { id: 'photography', skillName: '摄影', helpText: '我可以帮助别人拍摄头像、活动照或产品图。' },
      { id: 'social-media', skillName: '社交媒体内容', helpText: '我可以帮助别人规划和制作社交媒体内容。' },
      { id: 'audio-editing', skillName: '音频编辑', helpText: '我可以帮助别人处理简单音频或播客素材。' },
    ],
  },
  {
    id: 'study-support',
    name: 'Study Support 学习支持类',
    skills: [
      { id: 'study-plan', skillName: '学习计划', helpText: '我可以帮助别人制定学习计划和任务拆分。' },
      { id: 'material-organize', skillName: '资料整理', helpText: '我可以帮助别人整理课程资料、笔记或阅读内容。' },
      { id: 'peer-feedback', skillName: '同伴反馈', helpText: '我可以帮助别人给作品、文档或展示提供反馈。' },
    ],
  },
]

export const ALL_SKILLS = SKILL_CATEGORIES.flatMap((category) =>
  category.skills.map((skill) => ({ ...skill, categoryId: category.id }))
)

export const MAX_CARD_SKILLS = 8
export const MAX_GENERATED_CARD_SKILLS = 6
export const CARD_BASE_WIDTH = 900
export const CARD_BASE_HEIGHT = 540
export const CARD_ASPECT_RATIO = '90 / 54'

export const QR_MODES = {
  UPLOAD: 'upload',
  LINK: 'link',
  SKILL_PAGE: 'skillPage',
}

export const QR_HINTS = {
  [QR_MODES.UPLOAD]: '扫码联系我',
  [QR_MODES.LINK]: '扫码查看我的作品',
  [QR_MODES.SKILL_PAGE]: '扫码查看我能帮你什么',
}

export const SKILL_PAGE_PLACEHOLDER_URL = 'https://example.com/skill-card'

export const INITIAL_FORM_DATA = {
  name: '',
  role: '',
  interests: '',
  strengths: '',
  experience: '',
  tagline: '',
  email: '',
  phone: '',
  portfolioUrl: '',
  socialMedia: '',
  avatar: null,
}

export const INITIAL_QR_DATA = {
  mode: QR_MODES.UPLOAD,
  uploadedImage: null,
  linkUrl: '',
}

export const MOCK_AI_ANALYSIS = {
  positioning: 'AI产品 × 用户体验 × 数字媒体',
  skills: [
    { id: 'mock-user-research', skillName: '用户研究' },
    { id: 'mock-ux-design', skillName: 'UX Design' },
    { id: 'mock-figma', skillName: 'Figma' },
    { id: 'mock-ai-dev', skillName: 'AI辅助开发' },
    { id: 'mock-visual-design', skillName: '视觉设计' },
  ],
  introduction:
    '具备数字媒体、用户研究与视觉设计背景，拥有跨学科项目实践经验，关注 AI 产品与用户体验的结合，能够从用户需求出发完成研究、设计与快速原型验证。',
}
