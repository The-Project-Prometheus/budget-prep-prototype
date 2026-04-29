'use client'

const SECTION: Record<string, string> = {
  users: 'Admin Panel', offices: 'Admin Panel', settings: 'Admin Panel',
  dashboard: 'Workspace', documents: 'Workspace', legacy: 'Workspace',
  allotments: 'Budget', obligations: 'Budget', saro: 'Budget',
  'sbps-dash': 'FY 2027 Budget Prep', 'sbps-ppmp': 'FY 2027 Budget Prep',
  'sbps-sbpf1': 'FY 2027 Budget Prep', 'sbps-sbpf2': 'FY 2027 Budget Prep',
  'sbps-proposal': 'FY 2027 Budget Prep', 'sbps-approvals': 'FY 2027 Budget Prep',
}

export default function Topbar({ page, pageTitle }: { page: string; pageTitle: string }) {
  return (
    <header className="topbar">
      <nav className="crumbs">
        <i className="pi pi-home" style={{ color: 'var(--fg-3)' }} />
        <span className="sep">/</span>
        <span>{SECTION[page] ?? 'Workspace'}</span>
        <span className="sep">/</span>
        <span className="here">{pageTitle}</span>
      </nav>
      <div className="search-box" style={{ maxWidth: 400 }}>
        <i className="pi pi-search" />
        <input placeholder="Search documents, offices, users…" />
      </div>
      <div className="topbar-right">
        <button className="icon-button" title="Notifications">
          <i className="pi pi-bell" />
        </button>
        <div className="avatar" style={{ background: 'hsl(215, 52%, 42%)' }} title="Juan Dela Cruz">
          JD
        </div>
      </div>
    </header>
  )
}
