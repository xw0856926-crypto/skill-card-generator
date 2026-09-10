export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function toggleSkillId(selectedIds, skillId) {
  if (selectedIds.includes(skillId)) {
    return selectedIds.filter((id) => id !== skillId)
  }
  return [...selectedIds, skillId]
}

export function getSelectedSkills(allSkills, selectedIds) {
  return selectedIds
    .map((id) => allSkills.find((skill) => skill.id === id))
    .filter(Boolean)
}

export function getSkillCardFileName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) return 'skill-card.png'

  const safeName = trimmed.replace(/[\\/:*?"<>|]/g, '').trim()
  if (!safeName) return 'skill-card.png'

  return `skill-card-${safeName}.png`
}

export async function waitForDocumentFonts() {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}

export async function waitForElementImages(root) {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve()
      }

      return new Promise((resolve) => {
        const finish = () => resolve()
        img.addEventListener('load', finish, { once: true })
        img.addEventListener('error', finish, { once: true })
      })
    })
  )
}
