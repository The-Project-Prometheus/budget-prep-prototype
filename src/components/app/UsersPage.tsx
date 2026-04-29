'use client'

import { useState, useMemo } from 'react'
import { BIS_USERS, BIS_ROLES, type BISUser, type UserStatus } from '@/lib/data'
import { useToast } from '@/components/ui/Toast'
import UserDrawer from './UserDrawer'
import InviteModal from './InviteModal'
import RolesModal from './RolesModal'

type Filter = 'all' | 'active' | 'pending' | 'suspended'

function avatarColor(hue: number) {
  return `hsl(${hue}, 52%, 42%)`
}

export default function UsersPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [drawerUser, setDrawerUser] = useState<BISUser | null>(null)
  const [drawerTab, setDrawerTab] = useState<'details'|'role'|'activity'|'security'>('details')
  const [showInvite, setShowInvite] = useState(false)
  const [showRoles, setShowRoles] = useState(false)
  const toast = useToast()

  const counts = useMemo(() => ({
    all:       BIS_USERS.length,
    active:    BIS_USERS.filter(u => u.status === 'active').length,
    pending:   BIS_USERS.filter(u => u.status === 'pending' || u.status === 'invited').length,
    suspended: BIS_USERS.filter(u => u.status === 'suspended' || u.status === 'disabled').length,
    mfa:       BIS_USERS.filter(u => u.mfa).length,
  }), [])

  const filtered = useMemo(() => {
    let us = BIS_USERS.slice()
    if (filter === 'active')    us = us.filter(u => u.status === 'active')
    if (filter === 'pending')   us = us.filter(u => u.status === 'pending' || u.status === 'invited')
    if (filter === 'suspended') us = us.filter(u => u.status === 'suspended' || u.status === 'disabled')
    if (search) {
      const q = search.toLowerCase()
      us = us.filter(u =>
        `${u.first} ${u.last}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.office.toLowerCase().includes(q)
      )
    }
    return us
  }, [filter, search])

  function toggleSel(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll(on: boolean) {
    if (on) setSelected(new Set(filtered.map(u => u.id)))
    else setSelected(new Set())
  }

  const allChecked = filtered.length > 0 && filtered.every(u => selected.has(u.id))

  function openDrawer(u: BISUser, tab: typeof drawerTab = 'details') {
    setDrawerUser(u)
    setDrawerTab(tab)
  }

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">Admin Panel · {BIS_USERS.length} Accounts</div>
          <h1>Users</h1>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('Exported users.csv', 'pi-download')}>
            <i className="pi pi-download" /> Export
          </button>
          <button className="btn secondary" onClick={() => setShowRoles(true)}>
            <i className="pi pi-sitemap" /> Manage Roles
          </button>
          <button className="btn primary" onClick={() => setShowInvite(true)}>
            <i className="pi pi-user-plus" /> Invite User
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="stat-strip">
        <div className="stat">
          <div className="lbl">Active <i className="pi pi-check-circle" style={{ color: 'rgb(var(--success-500))' }} /></div>
          <div className="val">{counts.active}</div>
          <div className="sub">Signed in within 30 days</div>
        </div>
        <div className="stat invert">
          <div className="lbl">Pending approval <i className="pi pi-hourglass" /></div>
          <div className="val">{counts.pending}</div>
          <div className="sub">Awaiting admin review</div>
        </div>
        <div className="stat">
          <div className="lbl">Suspended <i className="pi pi-ban" style={{ color: 'rgb(var(--error-500))' }} /></div>
          <div className="val">{counts.suspended}</div>
          <div className="sub">Blocked from sign-in</div>
        </div>
        <div className="stat accent">
          <div className="lbl">MFA enrolled <i className="pi pi-lock" /></div>
          <div className="val">
            {counts.mfa}
            <span style={{ fontSize: 14, color: 'var(--fg-3)', fontWeight: 500 }}> / {counts.all}</span>
          </div>
          <div className="sub">Registered one-time devices</div>
        </div>
      </div>

      <div className="panel">
        {/* Filter row */}
        <div className="filter-row">
          <div className="search-box" style={{ maxWidth: 360, background: 'rgb(var(--surface-50))', marginLeft: 0 }}>
            <i className="pi pi-search" />
            <input
              placeholder="Search by name, email, or office…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="seg">
            {(['all','active','pending','suspended'] as Filter[]).map(f => (
              <button
                key={f}
                className={filter === f ? 'on' : ''}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}{' '}
                <span className="pill-count">{counts[f]}</span>
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn secondary sm"><i className="pi pi-filter" /> Office</button>
          <button className="btn secondary sm"><i className="pi pi-tag" /> Role</button>
        </div>

        {/* Bulk bar */}
        <div className={`bulk-bar${selected.size > 0 ? ' on' : ''}`}>
          <span className="bulk-count">{selected.size} selected</span>
          <button onClick={() => toast('Reset password emails queued.', 'pi-envelope')}>
            <i className="pi pi-refresh" /> Reset password
          </button>
          <button onClick={() => toast('Role change applied.', 'pi-tag')}>
            <i className="pi pi-tag" /> Change role
          </button>
          <button onClick={() => toast('Users suspended.', 'pi-ban')}>
            <i className="pi pi-ban" /> Suspend
          </button>
          <div className="spacer" />
          <button className="ghost" onClick={() => setSelected(new Set())}>
            <i className="pi pi-times" /> Clear
          </button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <img src="/assets/images/no-receivable-document.svg" alt="" />
            <h4>No users match these filters.</h4>
            <p>Try another search or clear the status filter.</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={e => toggleAll(e.target.checked)}
                  />
                </th>
                <th>Name <span>↑</span></th>
                <th>Office</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const R = BIS_ROLES[u.role]
                const sel = selected.has(u.id)
                return (
                  <tr
                    key={u.id}
                    className={sel ? 'sel' : ''}
                    onClick={() => openDrawer(u)}
                  >
                    <td style={{ width: 36 }}>
                      <input
                        type="checkbox"
                        checked={sel}
                        onClick={e => e.stopPropagation()}
                        onChange={() => toggleSel(u.id)}
                      />
                    </td>
                    <td>
                      <div className="u-cell">
                        <div className="u-ava" style={{ background: avatarColor(u.hue) }}>
                          {u.initials}
                        </div>
                        <div>
                          <div className="u-name">
                            {u.first} {u.last}
                            {u.mfa && (
                              <i
                                className="pi pi-lock"
                                title="MFA enrolled"
                                style={{ color: 'rgb(var(--success-600))', fontSize: 11, marginLeft: 4 }}
                              />
                            )}
                          </div>
                          <div className="u-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.office}</td>
                    <td>
                      <span className={`role-tag ${u.role}`}>
                        <i className={`pi ${R.icon}`} /> {R.name}
                      </span>
                    </td>
                    <td>
                      <span className={`chip ${u.status}`}>
                        <span className="cdot" />{u.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {u.lastActive}
                    </td>
                    <td style={{ width: 140 }}>
                      <div className="row-actions">
                        <button
                          title="Reset password"
                          onClick={e => { e.stopPropagation(); toast(`Reset link sent to ${u.email}`, 'pi-envelope') }}
                        >
                          <i className="pi pi-refresh" />
                        </button>
                        <button
                          title="Edit role"
                          onClick={e => { e.stopPropagation(); openDrawer(u, 'role') }}
                        >
                          <i className="pi pi-tag" />
                        </button>
                        <button title="More" onClick={e => e.stopPropagation()}>
                          <i className="pi pi-ellipsis-h" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <div>Showing <b>1–{Math.min(8, filtered.length)}</b> of <b>{filtered.length}</b> users</div>
          <div className="pager">
            <button><i className="pi pi-angle-left" /></button>
            <button className="on">1</button>
            <button>2</button>
            <button><i className="pi pi-angle-right" /></button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerUser && (
        <UserDrawer
          user={drawerUser}
          initialTab={drawerTab}
          onClose={() => setDrawerUser(null)}
        />
      )}

      {/* Modals */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {showRoles  && <RolesModal  onClose={() => setShowRoles(false)} />}
    </>
  )
}
