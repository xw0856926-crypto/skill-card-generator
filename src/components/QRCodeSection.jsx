import { QRCodeSVG } from 'qrcode.react'
import {
  QR_HINTS,
  QR_MODES,
  SKILL_PAGE_PLACEHOLDER_URL,
} from '../data/skills'
import { readFileAsDataUrl } from '../utils/helpers'

function QRCodeSection({ qrData, onChange }) {
  const handleModeChange = (mode) => {
    onChange({ ...qrData, mode })
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    onChange({ ...qrData, uploadedImage: dataUrl })
  }

  const handleImageRemove = () => {
    onChange({ ...qrData, uploadedImage: null })
  }

  const handleLinkChange = (event) => {
    onChange({ ...qrData, linkUrl: event.target.value })
  }

  return (
    <div className="qr-section">
      <h3 className="qr-section__title">二维码设置</h3>

      <div className="qr-mode-tabs">
        <label className="qr-mode-tab">
          <input
            type="radio"
            name="qrMode"
            value={QR_MODES.UPLOAD}
            checked={qrData.mode === QR_MODES.UPLOAD}
            onChange={() => handleModeChange(QR_MODES.UPLOAD)}
          />
          <span>上传二维码</span>
        </label>
        <label className="qr-mode-tab">
          <input
            type="radio"
            name="qrMode"
            value={QR_MODES.LINK}
            checked={qrData.mode === QR_MODES.LINK}
            onChange={() => handleModeChange(QR_MODES.LINK)}
          />
          <span>链接生成</span>
        </label>
        <label className="qr-mode-tab">
          <input
            type="radio"
            name="qrMode"
            value={QR_MODES.SKILL_PAGE}
            checked={qrData.mode === QR_MODES.SKILL_PAGE}
            onChange={() => handleModeChange(QR_MODES.SKILL_PAGE)}
          />
          <span>技能详情页</span>
        </label>
      </div>

      {qrData.mode === QR_MODES.UPLOAD && (
        <div className="qr-panel">
          <p className="qr-panel__hint">
            上传微信好友二维码、Instagram QR code、作品集二维码等。
          </p>
          {qrData.uploadedImage ? (
            <div className="qr-upload-preview">
              <img src={qrData.uploadedImage} alt="二维码预览" />
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={handleImageRemove}
              >
                移除图片
              </button>
            </div>
          ) : (
            <label className="file-input-label" htmlFor="qrUpload">
              选择二维码图片
            </label>
          )}
          <input
            id="qrUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          <p className="qr-panel__note">卡片提示语：{QR_HINTS[QR_MODES.UPLOAD]}</p>
        </div>
      )}

      {qrData.mode === QR_MODES.LINK && (
        <div className="qr-panel">
          <p className="qr-panel__hint">
            输入作品集链接、LinkedIn、小红书、Instagram 等 URL。
          </p>
          <input
            type="url"
            placeholder="https://..."
            value={qrData.linkUrl}
            onChange={handleLinkChange}
            className="qr-link-input"
          />
          {qrData.linkUrl && (
            <div className="qr-generated-preview">
              <QRCodeSVG value={qrData.linkUrl} size={80} />
            </div>
          )}
          <p className="qr-panel__note">卡片提示语：{QR_HINTS[QR_MODES.LINK]}</p>
        </div>
      )}

      {qrData.mode === QR_MODES.SKILL_PAGE && (
        <div className="qr-panel">
          <p className="qr-panel__hint">
            第一版使用占位链接，扫码后可查看技能详情（后续版本将支持在线页面）。
          </p>
          <p className="qr-panel__url">{SKILL_PAGE_PLACEHOLDER_URL}</p>
          <div className="qr-generated-preview">
            <QRCodeSVG value={SKILL_PAGE_PLACEHOLDER_URL} size={80} />
          </div>
          <p className="qr-panel__note">卡片提示语：{QR_HINTS[QR_MODES.SKILL_PAGE]}</p>
        </div>
      )}
    </div>
  )
}

export default QRCodeSection
