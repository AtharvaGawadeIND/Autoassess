import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAssessment, getResults, exportResultsUrl } from '../api/client.js'
import StatusTag from '../components/StatusTag.jsx'
import ResultsTable from '../components/ResultsTable.jsx'
import Stepper from '../components/Stepper.jsx'
import { IconDownload, IconAlert } from '../components/Icons.jsx'

const PIPELINE = ['queued', 'ocr', 'mapping', 'scoring']
const PIPELINE_STEPS = [
  { label: 'Queued' },
  { label: 'OCR' },
  { label: 'Question mapping' },
  { label: 'Scoring' },
]

export default function AssessmentDetail() {
  const { id } = useParams()
  const [assessment, setAssessment] = useState(null)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let timer

    async function poll() {
      try {
        const a = await getAssessment(id)
        if (cancelled) return
        setAssessment(a)
        if (a.status === 'done') {
          setResults(await getResults(id))
        } else if (a.status !== 'failed') {
          timer = setTimeout(poll, 1500)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }
    poll()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [id])

  if (error) {
    return (
      <div>
        <p style={{ color: 'var(--bad)' }}>{error}</p>
        <Link to="/">← Back to batches</Link>
      </div>
    )
  }

  if (!assessment) return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>

  const currentIdx = PIPELINE.indexOf(assessment.status)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{assessment.title}</h1>
          <p>{assessment.student_count} answer sheets in this batch</p>
        </div>
        <StatusTag status={assessment.status} progress={assessment.progress} />
      </div>

      {assessment.status !== 'done' && assessment.status !== 'failed' && (
        <Stepper steps={PIPELINE_STEPS} currentIndex={currentIdx} />
      )}

      {assessment.status === 'failed' && (
        <div className="card" style={{ borderColor: 'var(--bad)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <IconAlert width={20} height={20} style={{ color: 'var(--bad)', flexShrink: 0, marginTop: '0.1rem' }} />
          <p style={{ color: 'var(--bad)' }}>
            {assessment.error || 'The pipeline failed for this batch. Check the backend logs.'}
          </p>
        </div>
      )}

      {assessment.status === 'done' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <a className="btn btn-ghost" href={exportResultsUrl(id, 'csv')} style={{ textDecoration: 'none' }}>
              <IconDownload width={16} height={16} />
              Export CSV
            </a>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <ResultsTable results={results} />
          </div>
        </>
      )}
    </div>
  )
}
