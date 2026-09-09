import React from 'react'
import { IconClock, IconCheckCircle, IconAlert } from './Icons.jsx'

const LABELS = {
  queued: 'Queued',
  ocr: 'Reading (OCR)',
  mapping: 'Mapping answers',
  scoring: 'Scoring',
  done: 'Done',
  failed: 'Failed',
}

const ICONS = {
  queued: IconClock,
  ocr: IconClock,
  mapping: IconClock,
  scoring: IconClock,
  done: IconCheckCircle,
  failed: IconAlert,
}

export default function StatusTag({ status, progress }) {
  const label = LABELS[status] || status
  const Icon = ICONS[status] || IconClock
  return (
    <span className={`tag tag-${status}`}>
      <Icon width={13} height={13} />
      {label}
      {typeof progress === 'number' && status !== 'done' && status !== 'failed' && progress > 0
        ? ` · ${progress}%`
        : ''}
    </span>
  )
}
