import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { analyzePersonalBrand } from './analyzeCore.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.post('/api/analyze', async (req, res) => {
  try {
    const { name, identity, interests, strengths, experience } = req.body || {}
    const result = await analyzePersonalBrand({
      name,
      identity,
      interests,
      strengths,
      experience,
    })
    res.json(result)
  } catch (error) {
    console.error('Analyze error:', error)
    res.status(error.status || 500).json({
      error: error.message || 'AI 分析失败，请稍后重试',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Skill card API running at http://localhost:${PORT}`)
})
