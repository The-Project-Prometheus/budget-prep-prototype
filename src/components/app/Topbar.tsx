'use client'

import type { AppPage } from './AppShell'

const PAGE_LABELS: Partial<Record<AppPage, string>> = {
  users: 'Users',
  dashboard: 'Dashboard',
  documents: 'My Documents',
  legacy: 'Legacy Records',
  allotments: 'Allotments',
  obligations: 'Obligations',
  saro: 'SARO Routing',
  offices: 'Offices',
  settings: 'Settings',
}

const SECTION: Partial<Record<AppPage, string>> = {
  users: 'Admin Panel',
  offices: 'Admin Panel',
  settings: 'Admin Panel',
  dashboard: 'Workspace',
  documents: 'Workspace',
  legacy: 'Workspace',
  allotments: 'Budget',
  obligations: 'Budget',
  saro: 'Budget',
}

export default function Topbar({ page }: { page: AppPage }) {
  return (
    <header className="topbar">
      <nav className="crumbs">
        <i className="pi pi-home" style={{ color: 'var(--fg-3)' }} />
        <span className="sep">/</span>
        <span>{SECTION[page] ?? 'Workspace'}</span>
        <span className="sep">/</span>
        <span className="here">{PAGE_LABELS[page] ?? page}</span>
      </nav>
      <div className="search-box" style={{ maxWidth: 400 }}>
        <i className="pi pi-search" />
        <input placeholder="Search documents, offices, users…" />
      </div>
      <div className="topbar-right">
        <button className="icon-button" title="Notifications">
          <i className="pi pi-bell" />
        </button>
        <div
          className="avatar"
          style={{ background: `hsl(215, 52%, 42%)` }}
          title="Juan Dela Cruz"
        >
          JD
        </div>
      </div>
    </header>
  )
}
