'use client'

import { useState } from 'react'
import { BIS_ROLES, BIS_PERMS, BIS_PERM_CATALOG, BIS_ACTIVITY, type BISUser, type UserRole } from '@/lib/data'
import { useToast } from '@/components/ui/Toast'

type Tab = 'details' | 'role' | 'activity' | 'security'

interface Props {
  user: BISUser
  initialTab: Tab
  onClose: () => void
}

function avatarColor(hue: number) {
  return `hsl(${hue}, 52%, 42%)`
}

export default function UserDrawer({ user, initialTab, onClose }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const toast = useToast()

  const R = BIS_ROLES[user.role]
  const perms = BIS_PERMS[selectedRole]

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <aside className="drawer show">
        {/* Head */}
        <div className="dw-head">
          <div className="u-ava" style={{ background: avatarColor(user.hue), width: 48, height: 48, fontSize: 15, borderRadius: 10 }}>
            {user.initials}
          </div>
          <div style={{ flex: 1 }}>
            <h3>{user.first} {user.last}</h3>
            <div className="sub">{user.email}</div>
            <div className="chips">
              <span className={`chip ${user.status}`}><span className="cdot" />{user.status}</span>
              <span className={`role-tag ${user.role}`}><i className={`pi ${R.icon}`} /> {R.name}</span>
              {user.mfa
                ? <span className="role-tag reviewer"><i className="pi pi-lock" /> MFA On</span>
                : <span className="role-tag" style={{ background: '#fef3c7', color: '#b45309' }}><i className="pi pi-exclamation-triangle" /> MFA Off</span>
              }
            </div>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        {/* Tabs */}
        <div className="dw-tabs">
          {(['details','role','activity','security'] as Tab[]).map(t => (
            <button
              key={t}
              className={`dw-tab${tab === t ? ' on' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'role' ? 'Role & Permissions' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="dw-body">
          {tab === 'details' && (
            <div className="dw-pane">
              <div className="dw-section">
                <h4>Account</h4>
                <dl className="kv-grid">
                  <dt>Full name</dt><dd>{user.first} {user.last}</dd>
                  <dt>Email</dt><dd className="mono">{user.email}</dd>
                  <dt>Office</dt><dd>{user.office}</dd>
                  <dt>Status</dt><dd><span className={`chip ${user.status}`}><span className="cdot" />{user.status}</span></dd>
                  <dt>Created</dt><dd className="mono">{user.created}</dd>
                  <dt>Last active</dt><dd className="mono">{user.lastActive}</dd>
                  <dt>User ID</dt><dd><span className="mono" style={{ fontSize: 11 }}>{user.id}</span></dd>
                </dl>
              </div>
            </div>
          )}

          {tab === 'role' && (
            <div className="dw-pane">
              <div className="dw-section">
                <h4>Assigned Role</h4>
                <div className="role-cards">
                  {(Object.entries(BIS_ROLES) as [UserRole, typeof BIS_ROLES[UserRole]][]).map(([k, r]) => (
                    <div
                      key={k}
                      className={`role-card${selectedRole === k ? ' on' : ''}`}
                      onClick={() => setSelectedRole(k)}
                    >
                      <i className={`pi ${r.icon}`} />
                      <div>
                        <div className="rc-name">{r.name}</div>
                        <div className="rc-desc">{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dw-section">
                <h4>Effective Permissions</h4>
                <div className="perm-grid">
                  {BIS_PERM_CATALOG.map(p => {
                    const on = perms.includes(p.id)
                    return (
                      <div key={p.id} className={`perm ${on ? 'perm-on' : 'perm-off'}`}>
                        <i className={`pi ${on ? 'pi-check-circle' : 'pi-circle'} perm-check`} />
                        <div style={{ flex: 1 }}>
                          <div className="perm-name">{p.name}</div>
                          <div className="perm-desc">{p.desc}</div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{p.id}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="dw-pane">
              <div className="dw-section">
                <h4>Recent Activity (last 30 days)</h4>
                <div className="act-list">
                  {BIS_ACTIVITY.map((a, i) => (
                    <div key={i} className={`act-row ${a.kind}`}>
                      <div className="act-dot" />
                      <div style={{ flex: 1 }}>
                        <div className="act-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                        <div className="act-meta">{a.ip}</div>
                      </div>
                      <div className="act-when">{a.when}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="dw-pane">
              <div className="dw-section">
                <h4>Authentication</h4>
                <dl className="kv-grid">
                  <dt>Password</dt>
                  <dd>
                    Updated 21 days ago ·{' '}
                    <button className="textlink" onClick={() => toast(`Reset link sent to ${user.email}`, 'pi-envelope')}>
                      Send reset link
                    </button>
                  </dd>
                  <dt>MFA</dt>
                  <dd>
                    {user.mfa
                      ? <><span className="chip active"><span className="cdot" />Enrolled</span> — iPhone (•••• 2401)</>
                      : <span className="chip pending"><span className="cdot" />Not enrolled</span>
                    }
                  </dd>
                  <dt>Trusted devices</dt><dd>{user.mfa ? '2 devices' : '0 devices'}</dd>
                  <dt>Sessions</dt>
                  <dd>
                    1 active ·{' '}
                    <button className="textlink" onClick={() => toast('All other sessions ended.', 'pi-sign-out')}>
                      End all other sessions
                    </button>
                  </dd>
                </dl>
              </div>
              <div className="dw-section">
                <h4>Danger Zone</h4>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn secondary" onClick={() => toast('Account suspended.', 'pi-ban')}>
                    <i className="pi pi-ban" /> Suspend account
                  </button>
                  <button className="btn danger-ghost" onClick={() => toast('Action requires confirmation.', 'pi-exclamation-circle')}>
                    <i className="pi pi-trash" /> Delete permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dw-foot">
          <button className="btn secondary" onClick={onClose}>Close</button>
          <button
            className="btn primary"
            onClick={() => { onClose(); toast(`Changes saved for ${user.first} ${user.last}.`, 'pi-check-circle') }}
          >
            <i className="pi pi-check" /> Save Changes
          </button>
        </div>
      </aside>
    </>
  )
}
