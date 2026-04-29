'use client'

import { accountByCode, peso, type PPMPItem } from '@/lib/budget-data'
import { useToast } from '@/components/ui/Toast'

export default function PPMPItemDrawer({ item, onClose }: { item: PPMPItem; onClose: () => void }) {
  const toast = useToast()
  const acct = accountByCode(item.account)
  const total = item.qty * item.unit_cost
  const procChip = item.proc === 'Competitive Bidding' ? 'in-review' : item.proc === 'Small Value' ? 'pending' : 'approved'

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <aside className="drawer show">
        <div className="dw-head">
          <div style={{ flex: 1 }}>
            <div className="sub" style={{ fontSize: 11 }}>PPMP Item · {item.id}</div>
            <h3>{item.desc}</h3>
            <div className="chips">
              <span className={`chip ${procChip}`}><span className="cdot" />{item.proc}</span>
              <span className="role-tag reviewer"><i className="pi pi-tag" /> {acct.name}</span>
              {item.flag && (
                <span className="role-tag" style={{ background: '#fef3c7', color: '#b45309' }}>
                  <i className="pi pi-flag-fill" /> {item.flag}
                </span>
              )}
            </div>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        <div className="dw-body">
          <div className="dw-pane">
            <div className="dw-section">
              <h4>Item Details</h4>
              <dl className="kv-grid">
                <dt>Description</dt><dd>{item.desc}</dd>
                <dt>Quantity</dt><dd className="mono">{item.qty} {item.unit}</dd>
                <dt>Unit Cost</dt><dd className="mono">{peso(item.unit_cost)}</dd>
                <dt>Total Cost</dt><dd className="mono"><b>{peso(total)}</b></dd>
                <dt>Procurement</dt><dd>{item.proc}</dd>
                <dt>Source of Funds</dt><dd>{item.src}</dd>
                <dt>Schedule</dt><dd>{item.sched}</dd>
              </dl>
            </div>

            <div className="dw-section">
              <h4>Account Mapping (Auto-suggested)</h4>
              <div className="perm perm-on">
                <i className="pi pi-check-circle perm-check" />
                <div>
                  <div className="perm-name">{acct.name}</div>
                  <div className="perm-desc">
                    {acct.type === 'CO' ? 'Capital Outlay' : `MOOE — ${acct.sub ?? ''}`}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{acct.code}</div>
              </div>
            </div>

            <div className="dw-section">
              <h4>Market Scoping Checklist (GPPB / NGPA)</h4>
              {item.scoping
                ? <div className="match-badge ok"><i className="pi pi-check-circle" /> Checklist complete — 7/7 items signed off</div>
                : <div className="match-badge bad"><i className="pi pi-exclamation-circle" /> Required before final PPMP submission</div>
              }
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)' }}>
                Reference document: <span className="mono">NGPA-MS-2024-rev3.pdf</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dw-foot">
          <button className="btn secondary" onClick={onClose}>Close</button>
          <button className="btn primary" onClick={() => { onClose(); toast('Item updated.', 'pi-check-circle') }}>
            <i className="pi pi-check" /> Save
          </button>
        </div>
      </aside>
    </>
  )
}
