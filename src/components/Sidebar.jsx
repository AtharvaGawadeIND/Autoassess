import React from 'react'
import { NavLink } from 'react-router-dom'
import { IconList } from './Icons.jsx'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-mark">
        <span className="sidebar-mark-word">AutoAssess</span>
        <span className="sidebar-mark-rule" />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <IconList width={17} height={17} />
          Batches
        </NavLink>
      </nav>

      <div className="sidebar-foot">Closed-ended · text-based scoring</div>
    </aside>
  )
}
