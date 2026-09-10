import { useMemo, useState } from 'react'
import Header from './components/Header'
import PersonalInfoForm from './components/PersonalInfoForm'
import AiAnalyzingState from './components/AiAnalyzingState'
import AiAnalysisPanel from './components/AiAnalysisPanel'
import SkillCardPreview from './components/SkillCardPreview'
import SkillDetailsPreview from './components/SkillDetailsPreview'
import { ALL_SKILLS, INITIAL_FORM_DATA, INITIAL_QR_DATA } from './data/skills'
import { requestAiAnalysis } from './api/analyze'
import { getSelectedSkills } from './utils/helpers'
import './App.css'

const PREVIEW_PLACEHOLDERS = {
  positioning: 'AI 将根据你的信息生成个人定位',
  skills: 'AI 将根据你的信息生成技能标签',
  introduction: 'AI 将根据你的信息生成个人介绍',
}

function buildCardData(formData, analysis) {
  const selectedSkills = analysis.skills.filter((skill) =>
    analysis.selectedSkillIds.includes(skill.id)
  )

  return {
    name: formData.name,
    role: formData.role,
    avatar: formData.avatar,
    positioning: analysis.positioning,
    introduction: analysis.introduction,
    skills: selectedSkills,
  }
}

function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [selectedSkillIds] = useState([])
  const [qrData] = useState(INITIAL_QR_DATA)
  const [analysis, setAnalysis] = useState(null)
  const [cardData, setCardData] = useState(null)
  const [isCardGenerated, setIsCardGenerated] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [workspaceView, setWorkspaceView] = useState('input')

  const selectedSkills = useMemo(
    () => getSelectedSkills(ALL_SKILLS, selectedSkillIds),
    [selectedSkillIds]
  )

  const previewSkills = useMemo(() => {
    if (!analysis) return []
    return analysis.skills.filter((skill) => analysis.selectedSkillIds.includes(skill.id))
  }, [analysis])

  const previewData = useMemo(
    () => ({
      name: formData.name,
      role: formData.role,
      avatar: formData.avatar,
      positioning: analysis?.positioning || '',
      introduction: analysis?.introduction || '',
      skills: previewSkills,
    }),
    [formData.name, formData.role, formData.avatar, analysis, previewSkills]
  )

  const previewPhase = isCardGenerated ? 'generated' : analysis ? 'analyzed' : 'awaiting'

  const handleFormChange = (nextFormData) => {
    setFormData(nextFormData)
    setIsCardGenerated(false)
  }

  const handleAnalyze = async () => {
    if (isAnalyzing) return

    setIsAnalyzing(true)
    setAnalyzeError('')
    setIsCardGenerated(false)
    setWorkspaceView('analyzing')

    try {
      const nextAnalysis = await requestAiAnalysis(formData)
      setAnalysis(nextAnalysis)
      setWorkspaceView('analysis')
    } catch (error) {
      console.error('AI analysis failed:', error)
      setAnalyzeError('AI 分析失败，请稍后重试')
      setWorkspaceView('input')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalysisChange = (nextAnalysis) => {
    setAnalysis(nextAnalysis)
    setIsCardGenerated(false)
  }

  const handleGenerateCard = () => {
    if (!analysis) return
    setCardData(buildCardData(formData, analysis))
    setIsCardGenerated(true)
  }

  return (
    <div className="app">
      <div className="app-shell">
        <Header />

        <main className="main-content">
          <div className="workspace-layout">
            <div className="workspace-layout__editor">
              <div className="workspace-switch" key={workspaceView}>
                {workspaceView === 'analyzing' ? (
                  <AiAnalyzingState />
                ) : workspaceView === 'analysis' && analysis ? (
                  <AiAnalysisPanel
                    analysis={analysis}
                    onChange={handleAnalysisChange}
                    onGenerateCard={handleGenerateCard}
                    isCardGenerated={isCardGenerated}
                    onBackToInput={() => setWorkspaceView('input')}
                  />
                ) : (
                  <PersonalInfoForm
                    formData={formData}
                    onChange={handleFormChange}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                    analyzeError={analyzeError}
                  />
                )}
              </div>
            </div>

            <div className="workspace-layout__preview">
              <SkillCardPreview
                cardData={cardData}
                previewData={previewData}
                placeholders={PREVIEW_PLACEHOLDERS}
                previewPhase={previewPhase}
                onRegenerate={handleGenerateCard}
                canRegenerate={Boolean(analysis)}
              />
            </div>
          </div>
        </main>

        <SkillDetailsPreview formData={formData} selectedSkills={selectedSkills} />
      </div>
    </div>
  )
}

export default App
