import React from 'react'
import { IconCheckCircle } from './Icons.jsx'

/**
 * steps: [{ label }]
 * currentIndex: index of the active step (0-based)
 */
export default function Stepper({ steps, currentIndex }) {
  return (
    <div className="stepper">
      {steps.map((step, i) => {
        const state = i < currentIndex ? 'complete' : i === currentIndex ? 'active' : ''
        return (
          <div className={`stepper-step ${state}`} key={step.label}>
            <div className="stepper-circle">
              {state === 'complete' ? <IconCheckCircle width={15} height={15} /> : i + 1}
            </div>
            <span className="stepper-label">{step.label}</span>
            {i < steps.length - 1 && <div className="stepper-line" />}
          </div>
        )
      })}
    </div>
  )
}
