'use client'

import type { AppPage } from './AppShell'

interface Props {
  currentPage: AppPage
  onNavigate: (p: AppPage) => void
  onSignOut: () => void
}

interface NavItem { page: AppPage; icon: string; label: string; badge?: string }

const WORKSPACE: NavItem[] = [
  { page: 'dashboard', icon: 'pi-chart-pie', label: 'Dashboard' },
  { page: 'documents', icon: 'pi-file',      label: 'My Documents' },
  { page: 'legacy',    icon: 'pi-inbox',     label: 'Legacy Records' },
]
const BUDGET: NavItem[] = [
  { page: 'allotments',  icon: 'pi-dollar',         label: 'Allotments' },
  { page: 'obligations', icon: 'pi-file-edit',       label: 'Obligations' },
  { page: 'saro',        icon: 'pi-bars-progress',   label: 'SARO Routing', badge: '3' },
]
const ADMIN: NavItem[] = [
  { page: 'users',    icon: 'pi-users',    label: 'Users' },
  { page: 'offices',  icon: 'pi-building', label: 'Offices' },
  { page: 'settings', icon: 'pi-cog',      label: 'Settings' },
]

export default function Sidebar({ currentPage, onNavigate, onSignOut }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/assets/senate_logo.png" alt="Senate" />
        <div>
          <div className="name">Senate of the Philippines</div>
          <div className="sub">Budget Info. System</div>
        </div>
      </div>

      <NavGroup label="Workspace" items={WORKSPACE} current={currentPage} onNavigate={onNavigate} />
      <NavGroup label="Budget"    items={BUDGET}    current={currentPage} onNavigate={onNavigate} />
      <NavGroup label="Admin Panel" items={ADMIN}   current={currentPage} onNavigate={onNavigate} />

      <div style={{ flex: 1 }} />
      <div
        className="nav-item"
        style={{ marginTop: 10, color: 'rgb(var(--error-600))' }}
        onClick={onSignOut}
      >
        <i className="pi pi-sign-out" style={{ color: 'rgb(var(--error-500))' }} />
        Sign out
      </div>
    </aside>
  )
}

function NavGroup({ label, items, current, onNavigate }: {
  label: string
  items: NavItem[]
  current: AppPage
  onNavigate: (p: AppPage) => void
}) {
  return (
    <div className="nav-group">
      <label>{label}</label>
      {items.map(item => (
        <div
          key={item.page}
          className={`nav-item${current === item.page ? ' active' : ''}`}
          onClick={() => onNavigate(item.page)}
        >
          <i className={`pi ${item.icon}`} />
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}
    </div>
  )
}
