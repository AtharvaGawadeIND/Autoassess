// In-memory mock backend. Mirrors the exact shapes described in client.js
// so replacing MOCK_MODE=false is a no-op for every component.

const STORE = new Map()
let counter = 0

const STAGES = ['queued', 'ocr', 'mapping', 'scoring', 'done']

function seedResults(studentCount) {
  const names = [
    'Rohan Deshmukh', 'Sneha Kulkarni', 'Aditya Patil', 'Isha Joshi',
    'Kunal Shinde', 'Prachi More', 'Yash Bhosale', 'Anaya Kale',
  ]
  return Array.from({ length: studentCount }).map((_, i) => {
    const questions = Array.from({ length: 5 }).map((__, q) => {
      const roll = Math.random()
      const verdict = roll > 0.7 ? 'correct' : roll > 0.35 ? 'partial' : 'incorrect'
      const max = 4
      const score = verdict === 'correct' ? max : verdict === 'partial' ? Math.round(max / 2) : 0
      return { question_no: `Q${q + 1}`, attempted: roll > 0.1, score, max_score: max, verdict }
    })
    const total = questions.reduce((s, q) => s + q.score, 0)
    const max = questions.reduce((s, q) => s + q.max_score, 0)
    return {
      student_id: `2023IT${100 + i}`,
      student_name: names[i % names.length],
      total_score: total,
      max_score: max,
      questions,
    }
  })
}

export function mockCreateAssessment({ title, answerSheets }) {
  counter += 1
  const id = `mock-${counter}`
  const studentCount = answerSheets?.length || 1
  const record = {
    id,
    title: title || `Untitled batch ${counter}`,
    status: 'queued',
    progress: 0,
    student_count: studentCount,
    created_at: new Date().toISOString(),
  }
  STORE.set(id, { meta: record, results: seedResults(studentCount) })

  // Simulate the pipeline advancing through stages over time.
  let stageIndex = 0
  const timer = setInterval(() => {
    stageIndex += 1
    const rec = STORE.get(id)
    if (!rec) return clearInterval(timer)
    rec.meta.status = STAGES[Math.min(stageIndex, STAGES.length - 1)]
    rec.meta.progress = Math.min(100, Math.round((stageIndex / (STAGES.length - 1)) * 100))
    if (stageIndex >= STAGES.length - 1) clearInterval(timer)
  }, 1600)

  return Promise.resolve(record)
}

export function mockList() {
  return Promise.resolve(Array.from(STORE.values()).map((r) => r.meta).reverse())
}

export function mockGetOne(id) {
  const rec = STORE.get(id)
  if (!rec) return Promise.reject(new Error('Assessment not found'))
  return Promise.resolve(rec.meta)
}

export function mockGetResults(id) {
  const rec = STORE.get(id)
  if (!rec) return Promise.reject(new Error('Assessment not found'))
  return Promise.resolve(rec.meta.status === 'done' ? rec.results : [])
}
