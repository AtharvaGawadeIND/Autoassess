import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadZone from '../components/UploadZone.jsx'
import Stepper from '../components/Stepper.jsx'
import { createAssessment } from '../api/client.js'
import { useAssessments } from '../context/AssessmentContext.jsx'

const STEPS = [{ label: 'Question paper' }, { label: 'Answer sheets' }, { label: 'Review & submit' }]

export default function NewAssessment() {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [questionPaper, setQuestionPaper] = useState([])
  const [answerSheets, setAnswerSheets] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { refresh } = useAssessments()

  const canNext =
    (step === 0 && questionPaper.length === 1) ||
    (step === 1 && answerSheets.length > 0) ||
    step === 2

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const created = await createAssessment({
        title: title || 'Untitled batch',
        questionPaper: questionPaper[0],
        answerSheets,
        onProgress: setProgress,
      })
      await refresh()
      navigate(`/assessments/${created.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>New assessment</h1>
          <p>Upload the question paper once, then every student's answer sheet for this batch.</p>
        </div>
      </div>

      <Stepper steps={STEPS} currentIndex={step} />

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {step === 0 && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 500 }}>
                Batch title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SE-IT Unit Test 2 — Data Structures"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  background: 'var(--surface)',
                }}
              />
            </div>
            <UploadZone
              label="Question paper"
              hint="One PDF or image containing every question for this test"
              multiple={false}
              files={questionPaper}
              onChange={setQuestionPaper}
            />
          </>
        )}

        {step === 1 && (
          <UploadZone
            label="Answer sheets"
            hint="One file per student — select or drag multiple at once"
            multiple
            files={answerSheets}
            onChange={setAnswerSheets}
          />
        )}

        {step === 2 && (
          <div className="review-panel">
            <h3 style={{ fontSize: '1rem', marginBottom: '0.9rem', fontWeight: 600 }}>
              Review before running the pipeline
            </h3>
            <dl className="review-list">
              <div>
                <dt>Title</dt>
                <dd>{title || 'Untitled batch'}</dd>
              </div>
              <div>
                <dt>Question paper</dt>
                <dd>{questionPaper[0]?.name}</dd>
              </div>
              <div>
                <dt>Answer sheets</dt>
                <dd>{answerSheets.length} file{answerSheets.length === 1 ? '' : 's'}</dd>
              </div>
            </dl>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.9rem' }}>
              Files run through OCR, then question mapping, then scoring. This can take a few
              minutes depending on batch size.
            </p>
          </div>
        )}

        {error && <p style={{ color: 'var(--bad)', fontSize: '0.85rem' }}>{error}</p>}
        {submitting && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
            Uploading… {progress}%
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
          <button
            className="btn btn-ghost"
            disabled={step === 0 || submitting}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button className="btn" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Continue
            </button>
          ) : (
            <button className="btn" disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Submitting…' : 'Run assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
