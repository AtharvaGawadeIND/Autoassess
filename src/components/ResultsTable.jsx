import React, { useState } from 'react'
import { IconChevron } from './Icons.jsx'

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function ResultsTable({ results }) {
  const [openId, setOpenId] = useState(null)

  if (results.length === 0) {
    return <p style={{ color: 'var(--ink-soft)', padding: '1.5rem' }}>No results yet.</p>
  }

  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Roll no.</th>
          <th>Score</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => {
          const isOpen = openId === r.student_id
          return (
            <React.Fragment key={r.student_id}>
              <tr onClick={() => setOpenId(isOpen ? null : r.student_id)} style={{ cursor: 'pointer' }}>
                <td>
                  <div className="student-cell">
                    <span className="student-avatar">{initials(r.student_name)}</span>
                    {r.student_name}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                  {r.student_id}
                </td>
                <td className="score-cell">
                  {r.total_score} / {r.max_score}
                </td>
                <td>
                  <button className={`row-expand-btn${isOpen ? ' open' : ''}`} type="button">
                    {isOpen ? 'Hide' : 'Details'}
                    <IconChevron width={14} height={14} />
                  </button>
                </td>
              </tr>
              {isOpen && (
                <tr className="detail-row">
                  <td colSpan={4}>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Attempted</th>
                          <th>Verdict</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.questions.map((q) => (
                          <tr key={q.question_no}>
                            <td>{q.question_no}</td>
                            <td>{q.attempted ? 'Yes' : 'No'}</td>
                            <td>
                              <span className={`verdict-pill verdict-${q.verdict}`}>{q.verdict}</span>
                            </td>
                            <td className="score-cell">
                              {q.score} / {q.max_score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
