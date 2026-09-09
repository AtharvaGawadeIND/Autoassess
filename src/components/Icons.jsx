import React from 'react'

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconList = (p) => (
  <svg {...base} {...p}>
    <line x1="8" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="20" y2="12" />
    <line x1="8" y1="18" x2="20" y2="18" />
    <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconUpload = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v11" />
    <path d="M7.5 8.5 12 4l4.5 4.5" />
    <path d="M5 16.5v1.75A2.75 2.75 0 0 0 7.75 21h8.5A2.75 2.75 0 0 0 19 18.25V16.5" />
  </svg>
)

export const IconDocument = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3.5h7.5L19 8v12.5A1.5 1.5 0 0 1 17.5 22h-10A1.5 1.5 0 0 1 6 20.5v-15A1.5 1.5 0 0 1 7 3.5Z" />
    <path d="M14 3.5V8h4.5" />
    <line x1="9" y1="12.5" x2="15" y2="12.5" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
)

export const IconUsers = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
    <circle cx="17" cy="8.5" r="2.3" />
    <path d="M15.8 14.7c2.3.3 4.2 2.3 4.2 5.3" />
  </svg>
)

export const IconCheckCircle = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12.3l2.4 2.4 4.6-5.2" />
  </svg>
)

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const IconAlert = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4 21.5 20.5h-19Z" />
    <line x1="12" y1="10" x2="12" y2="14.5" />
    <circle cx="12" cy="17.3" r="0.15" fill="currentColor" stroke="none" />
  </svg>
)

export const IconDownload = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v11" />
    <path d="M7.5 11.5 12 16l4.5-4.5" />
    <path d="M5 16.5v1.75A2.75 2.75 0 0 0 7.75 21h8.5A2.75 2.75 0 0 0 19 18.25V16.5" />
  </svg>
)

export const IconChevron = (p) => (
  <svg {...base} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const IconX = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
