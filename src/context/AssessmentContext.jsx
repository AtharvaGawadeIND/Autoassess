import React, { createContext, useCallback, useContext, useState } from 'react'
import { listAssessments } from '../api/client.js'

const Ctx = createContext(null)

export function AssessmentProvider({ children }) {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listAssessments()
      setAssessments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Ctx.Provider value={{ assessments, loading, error, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAssessments() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAssessments must be used within AssessmentProvider')
  return ctx
}
