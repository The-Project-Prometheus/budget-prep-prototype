'use client'

interface Props {
  currentPage: string
  onNavigate: (p: string) => void
  onSignOut: () => void
}

interface NavItem { page: string; icon: string; label: string; badge?: string; alert?: boolean }

const WORKSPACE: NavItem[] = [
  { page: 'dashboard', icon: 'pi-chart-pie',  label: 'Dashboard' },
  { page: 'documents', icon: 'pi-file',        label: 'My Documents' },
  { page: 'legacy',    icon: 'pi-inbox',       label: 'Legacy Records' },
]
const BUDGET_PREP: NavItem[] = [
  { page: 'sbps-dash',      icon: 'pi-chart-bar',  label: 'Overview' },
  { page: 'sbps-ppmp',      icon: 'pi-list-check', label: 'PPMP' },
  { page: 'sbps-sbpf1',     icon: 'pi-file-edit',  label: 'SBPF1 — In PPMP' },
  { page: 'sbps-sbpf2',     icon: 'pi-file-plus',  label: 'SBPF2 — Non-PPMP' },
  { page: 'sbps-proposal',  icon: 'pi-book',       label: 'Proposal Summary' },
  { page: 'sbps-approvals', icon: 'pi-inbox',      label: 'Approvals Inbox', badge: '2', alert: true },
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

      <NavGroup label="Workspace"           items={WORKSPACE}   current={currentPage} onNavigate={onNavigate} />
      <NavGroup label="FY 2027 Budget Prep" items={BUDGET_PREP} current={currentPage} onNavigate={onNavigate} />
      <NavGroup label="Admin Panel"         items={ADMIN}       current={currentPage} onNavigate={onNavigate} />

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
  label: string; items: NavItem[]; current: string; onNavigate: (p: string) => void
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
          {item.badge && (
            <span className={`nav-badge${item.alert && current !== item.page ? ' alert' : ''}`}>
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
