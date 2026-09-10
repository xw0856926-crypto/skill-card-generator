import { useLayoutEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { CARD_BASE_HEIGHT, CARD_BASE_WIDTH } from '../data/skills'
import {
  getSkillCardFileName,
  waitForDocumentFonts,
  waitForElementImages,
} from '../utils/helpers'
import CardContent from './CardContent'

function SkillCardPreview({
  cardData,
  previewData,
  placeholders,
  previewPhase = 'awaiting',
  onRegenerate,
  canRegenerate,
}) {
  const exportCardRef = useRef(null)
  const previewStageRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const isGenerated = Boolean(cardData)

  useLayoutEffect(() => {
    const stage = previewStageRef.current
    if (!stage) return

    const updateScale = () => {
      const styles = window.getComputedStyle(stage)
      const paddingX =
        Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
      const availableWidth = stage.clientWidth - paddingX
      if (availableWidth <= 0) return
      setPreviewScale(availableWidth / CARD_BASE_WIDTH)
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const handleDownload = async () => {
    if (!isGenerated) {
      alert('请先生成个人名片')
      return
    }

    if (!exportCardRef.current || isDownloading) return

    setIsDownloading(true)

    try {
      await waitForDocumentFonts()
      await waitForElementImages(exportCardRef.current)

      const dataUrl = await toPng(exportCardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      })

      const link = document.createElement('a')
      link.download = getSkillCardFileName(cardData.name)
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('导出 PNG 失败:', error)
      alert('导出失败，请稍后重试。')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="panel card-preview-panel">
      <div className="card-preview-panel__head">
        <div>
          <h2 className="panel__title">你的个人名片</h2>
          <p className="panel__desc">
            {previewPhase === 'generated'
              ? '名片已生成，可下载 PNG 用于作品集与社交分享。'
              : previewPhase === 'analyzed'
                ? 'AI 已整理个人定位、技能和介绍，确认后即可生成名片。'
                : '姓名、身份和头像会实时显示。个人定位、技能和介绍将在 AI 提炼后出现。'}
          </p>
        </div>
        <div className="preview-tabs" aria-label="预览模式">
          <button type="button" className="preview-tabs__btn is-active">
            <span className="preview-tabs__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            预览效果
          </button>
        </div>
      </div>

      <div className="card-stage" ref={previewStageRef}>
        <div className="skill-card-wrapper">
          <div
            className="card-preview-frame"
            style={{
              '--preview-scale': previewScale,
              width: '100%',
              maxWidth: 'none',
              height: `${CARD_BASE_HEIGHT * previewScale}px`,
            }}
          >
            <div className={`card-preview-scaler is-${previewPhase}`}>
              <CardContent
                data={previewData}
                placeholders={previewPhase === 'awaiting' ? placeholders : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {isGenerated && (
        <div className="export-card-wrapper" aria-hidden="true">
          <CardContent ref={exportCardRef} data={cardData} />
        </div>
      )}

      <div className="card-preview-actions">
        <button
          type="button"
          className={`btn btn--download ${isGenerated ? 'is-ready' : ''}`}
          onClick={handleDownload}
          disabled={isDownloading || !isGenerated}
        >
          <span className="btn__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7.5 11.5 12 16l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          {isDownloading ? '正在生成图片…' : '下载个人名片 PNG'}
        </button>
        <button
          type="button"
          className="btn btn--regenerate"
          onClick={() => {
            if (typeof onRegenerate === 'function') onRegenerate()
          }}
          disabled={!canRegenerate}
        >
          <span className="btn__icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l10.2-10.2a2.3 2.3 0 0 0-3.25-3.25L4.75 16.75 4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          重新生成
        </button>
      </div>
    </section>
  )
}

export default SkillCardPreview
