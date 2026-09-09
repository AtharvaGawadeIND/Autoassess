import React, { useCallback, useRef, useState } from 'react'
import { IconUpload, IconDocument, IconX } from './Icons.jsx'

/**
 * Generic file drop zone.
 * - multiple=false  -> single file (question paper)
 * - multiple=true   -> many files (answer sheets, one per student)
 */
export default function UploadZone({
  label,
  hint,
  accept = '.pdf,.png,.jpg,.jpeg',
  multiple = false,
  files,
  onChange,
}) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const addFiles = useCallback(
    (incoming) => {
      const list = Array.from(incoming)
      if (multiple) onChange([...(files || []), ...list])
      else onChange(list.slice(0, 1))
    },
    [files, multiple, onChange],
  )

  const removeAt = (idx) => {
    const next = [...files]
    next.splice(idx, 1)
    onChange(next)
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
      >
        <div className="upload-zone-icon">
          <IconUpload />
        </div>
        <strong style={{ fontSize: '0.98rem' }}>{label}</strong>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.84rem', marginTop: '0.35rem' }}>
          {hint || 'Drag a file here, or click to browse'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => e.target.files?.length && addFiles(e.target.files)}
        />
      </div>

      {files && files.length > 0 && (
        <ul className="upload-file-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <IconDocument width={15} height={15} />
              <span className="upload-file-name">{f.name}</span>
              <span className="upload-file-size">{(f.size / 1024).toFixed(0)} KB</span>
              <button
                type="button"
                className="upload-file-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  removeAt(i)
                }}
                aria-label={`Remove ${f.name}`}
              >
                <IconX width={14} height={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
