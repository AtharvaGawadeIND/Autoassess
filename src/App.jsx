import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewAssessment from './pages/NewAssessment.jsx'
import AssessmentDetail from './pages/AssessmentDetail.jsx'
import './app.css'

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="shell-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewAssessment />} />
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
