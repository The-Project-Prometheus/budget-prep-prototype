'use client'

import { BIS_ROLES, BIS_USERS, BIS_PERMS, type UserRole } from '@/lib/data'
import { useToast } from '@/components/ui/Toast'

export default function RolesModal({ onClose }: { onClose: () => void }) {
  const toast = useToast()

  return (
    <>
      <div className="modal-scrim show" onClick={onClose} />
      <div className="modal show">
        <div className="modal-head">
          <div>
            <h3>Roles &amp; Permissions</h3>
            <p>Five roles cover the legislative workflow. Custom roles must be approved by an Administrator.</p>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        <div className="modal-body">
          {(Object.entries(BIS_ROLES) as [UserRole, typeof BIS_ROLES[UserRole]][]).map(([k, r]) => {
            const count = BIS_USERS.filter(u => u.role === k).length
            const permsCount = BIS_PERMS[k].length
            return (
              <div
                key={k}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr auto auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: '12px 14px',
                  border: '1px solid rgb(var(--surface-200))',
                  borderRadius: 8,
                }}
              >
                <i className={`pi ${r.icon}`} style={{ color: 'rgb(var(--primary-600))', fontSize: 18 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.4, marginTop: 2 }}>{r.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-menu)', fontWeight: 700, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                    {count} users
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                    {permsCount} permissions
                  </div>
                </div>
                <button className="btn secondary sm" onClick={() => toast(`Editing role: ${r.name}`, 'pi-pencil')}>
                  <i className="pi pi-pencil" /> Edit
                </button>
              </div>
            )
          })}
          <button className="btn ghost" style={{ alignSelf: 'flex-start' }} onClick={() => toast('Custom role creation coming soon.', 'pi-plus')}>
            <i className="pi pi-plus" /> Create Custom Role
          </button>
        </div>

        <div className="modal-foot">
          <button className="btn secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  )
}
