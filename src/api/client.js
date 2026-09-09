/**
 * AutoAssess API client
 * ----------------------
 * Every network call the frontend makes lives in this one file.
 * Swap MOCK_MODE to false once the FastAPI backend implements the
 * routes below — no other file needs to change.
 *
 * Expected FastAPI contract (Phase 1, closed-ended/fixed-answer questions):
 *
 *   POST   /api/assessments
 *          multipart/form-data: question_paper (file), answer_sheets (file[]), title (str)
 *          -> 201 { id, title, status: "queued", created_at }
 *
 *   GET    /api/assessments
 *          -> 200 [ { id, title, status, student_count, created_at }, ... ]
 *
 *   GET    /api/assessments/{id}
 *          -> 200 {
 *               id, title, status: "queued"|"ocr"|"mapping"|"scoring"|"done"|"failed",
 *               progress: 0-100, student_count, created_at, error?: string
 *             }
 *
 *   GET    /api/assessments/{id}/results
 *          -> 200 [
 *               {
 *                 student_id, student_name,
 *                 total_score, max_score,
 *                 questions: [
 *                   { question_no, attempted: bool, score, max_score, verdict: "correct"|"partial"|"incorrect" }
 *                 ]
 *               }, ...
 *             ]
 *
 *   GET    /api/assessments/{id}/export?format=csv
 *          -> file download (Content-Disposition: attachment)
 *
 * Auth: none yet. If you add auth, attach the header inside `request()` below
 * so every call picks it up automatically.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Flip to false the moment the backend is reachable. Left on by default
// so the UI is fully clickable/demo-able before FastAPI exists.
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    let detail
    try {
      detail = (await res.json()).detail
    } catch {
      detail = res.statusText
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res
}

// ---- mock data used only while MOCK_MODE is true ------------------------
import { mockCreateAssessment, mockList, mockGetOne, mockGetResults } from './mockData.js'

export async function listAssessments() {
  if (MOCK_MODE) return mockList()
  return request('/assessments')
}

export async function getAssessment(id) {
  if (MOCK_MODE) return mockGetOne(id)
  return request(`/assessments/${id}`)
}

export async function getResults(id) {
  if (MOCK_MODE) return mockGetResults(id)
  return request(`/assessments/${id}/results`)
}

export async function createAssessment({ title, questionPaper, answerSheets, onProgress }) {
  if (MOCK_MODE) return mockCreateAssessment({ title, questionPaper, answerSheets })

  const form = new FormData()
  form.append('title', title)
  form.append('question_paper', questionPaper)
  answerSheets.forEach((file) => form.append('answer_sheets', file))

  // Using XHR (not fetch) only so we can report upload progress in the UI.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE_URL}/assessments`)
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(`Upload failed (${xhr.status})`))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(form)
  })
}

export function exportResultsUrl(id, format = 'csv') {
  return `${BASE_URL}/assessments/${id}/export?format=${format}`
}
