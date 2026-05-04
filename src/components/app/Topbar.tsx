'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCrumbForPage, type Cycle } from '@/lib/nav-data'

interface Props {
  page: string
  pageTitle: string
  cycle: Cycle
}

export default function Topbar({ page, pageTitle: _pageTitle, cycle }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const crumbs = getCrumbForPage(page)

  useEffect(() => {
    if (!menuOpen) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  return (
    <header className="topbar">
      <nav className="crumbs">
        <i className="pi pi-home" style={{ color: 'var(--fg-3)' }} />
        <span className="sep">/</span>
        <span className="crumb-cycle">
          <b>{cycle.fy}</b>
          <span className="crumb-cycle-phase">{cycle.phase}</span>
        </span>
        {crumbs.map((part, i) => (
          <span key={i}>
            <span className="sep">/</span>
            <span className={i === crumbs.length - 1 ? 'here' : ''}>{part}</span>
          </span>
        ))}
      </nav>

      <div className="search-box" style={{ maxWidth: 380 }}>
        <i className="pi pi-search" />
        <input placeholder="Search documents, offices, users…" />
      </div>

      <div className="topbar-right">
        <button className="icon-button" title="Notifications">
          <i className="pi pi-bell" />
          <span className="dot" />
        </button>
        <button className="icon-button" title="Help">
          <i className="pi pi-question-circle" />
        </button>

        {/* User menu */}
        <div ref={menuRef} className="user-menu-wrap">
          <button
            className="avatar"
            style={{ background: 'hsl(215, 52%, 42%)' }}
            title="Juan Dela Cruz"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
          >
            JD
          </button>
          {menuOpen && (
            <div className="user-menu">
              <div className="user-menu-head">
                <div className="avatar lg" style={{ background: 'hsl(215, 52%, 42%)' }}>JD</div>
                <div>
                  <div className="user-menu-name">Juan Dela Cruz</div>
                  <div className="user-menu-sub">Committee on Finance · Director</div>
                </div>
              </div>
              <a className="user-menu-item"><i className="pi pi-user" /> My Profile</a>
              <a className="user-menu-item"><i className="pi pi-id-card" /> My Office</a>
              <a className="user-menu-item"><i className="pi pi-cog" /> Preferences</a>
              <div className="user-menu-sep" />
              <a
                className="user-menu-item danger"
                onClick={() => { setMenuOpen(false); router.push('/auth') }}
              >
                <i className="pi pi-sign-out" /> Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
