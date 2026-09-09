import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAssessments } from '../context/AssessmentContext.jsx'
import StatusTag from '../components/StatusTag.jsx'
import { IconDocument, IconPlus } from '../components/Icons.jsx'

export default function Dashboard() {
  const { assessments, loading, error, refresh } = useAssessments()

  useEffect(() => {
    refresh()
    // Poll while anything is still in-flight, so status tags update live.
    const t = setInterval(refresh, 2000)
    return () => clearInterval(t)
  }, [refresh])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Assessment batches</h1>
          <p>
            Each batch pairs one question paper with a set of student answer sheets and runs
            through OCR, question mapping, and scoring.
          </p>
        </div>
        {assessments.length > 0 && (
          <Link to="/new" className="btn" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <IconPlus width={16} height={16} />
            New assessment
          </Link>
        )}
      </div>

      {error && <p style={{ color: 'var(--bad)' }}>{error}</p>}

      {!loading && assessments.length === 0 && (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <IconDocument width={22} height={22} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No batches yet</h3>
          <p style={{ marginBottom: '1.25rem', color: 'var(--ink-soft)' }}>
            Upload a question paper and a set of answer sheets to start your first run.
          </p>
          <Link to="/new" className="btn" style={{ textDecoration: 'none' }}>
            <IconPlus width={16} height={16} />
            Start an assessment
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {assessments.map((a) => (
          <Link
            key={a.id}
            to={`/assessments/${a.id}`}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 600 }}>{a.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {a.student_count} answer sheet{a.student_count === 1 ? '' : 's'} · started{' '}
                {new Date(a.created_at).toLocaleString()}
              </p>
            </div>
            <StatusTag status={a.status} progress={a.progress} />
          </Link>
        ))}
      </div>
    </div>
  )
}
