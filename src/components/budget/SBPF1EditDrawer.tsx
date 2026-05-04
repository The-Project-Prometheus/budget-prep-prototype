'use client'

import { useState } from 'react'
import { SBPS_ACCOUNTS, accountByCode, peso, type PPMPItem } from '@/lib/budget-data'
import { useToast } from '@/components/ui/Toast'
import PvDropdown from '@/components/ui/PvDropdown'

interface Props {
  item: PPMPItem
  onClose: () => void
  onSave: (updated: PPMPItem) => void
}

const PROC_OPTIONS = [
  'Shopping',
  'Small Value',
  'Competitive Bidding',
  'Direct Contracting',
  'Negotiated Procurement',
]

export default function SBPF1EditDrawer({ item, onClose, onSave }: Props) {
  const toast = useToast()
  const [qty, setQty]         = useState(item.qty)
  const [unit, setUnit]       = useState(item.unit)
  const [unitCost, setUnitCost] = useState(item.unit_cost)
  const [desc, setDesc]       = useState(item.desc)
  const [proc, setProc]       = useState(item.proc)
  const [sched, setSched]     = useState(item.sched)
  const [src, setSrc]         = useState(item.src)
  const [account, setAccount] = useState(item.account)
  const [scoping, setScoping] = useState(item.scoping)

  const total = qty * unitCost
  const acct  = accountByCode(account)
  const procChip = proc === 'Competitive Bidding' ? 'in-review' : proc === 'Small Value' ? 'pending' : 'approved'

  function handleSave() {
    const updated: PPMPItem = { ...item, qty, unit, unit_cost: unitCost, desc, proc, sched, src, account, scoping }
    onSave(updated)
    onClose()
    toast('Item updated.', 'pi-check-circle')
  }

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <aside className="drawer show">
        {/* Head */}
        <div className="dw-head">
          <div style={{ flex: 1 }}>
            <div className="sub">{item.id} · PPMP / SBPF1 Item</div>
            <h3>{desc}</h3>
            <div className="chips">
              <span className={`chip ${procChip}`}><span className="cdot" />{proc}</span>
              <span className="role-tag reviewer"><i className="pi pi-tag" /> {acct.name}</span>
              {item.flag && <span className="role-tag" style={{ background:'#fef3c7', color:'#b45309' }}><i className="pi pi-flag-fill" /> {item.flag}</span>}
            </div>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        {/* Body */}
        <div className="dw-body form" style={{ overflow: 'auto', flex: 1 }}>
          <div className="dw-section">
            <h4>Description</h4>
            <div className="field">
              <label>General Description</label>
              <div className="input-wrap">
                <input value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="dw-section">
            <h4>Quantity &amp; Cost</h4>
            <div className="grid-2">
              <div className="field">
                <label>Quantity</label>
                <div className="input-wrap">
                  <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} />
                </div>
              </div>
              <div className="field">
                <label>Unit</label>
                <div className="input-wrap">
                  <input value={unit} onChange={e => setUnit(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Unit Cost (₱)</label>
                <div className="input-wrap">
                  <input type="number" min={0} value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} />
                </div>
              </div>
              <div className="field">
                <label>Total Cost</label>
                <div className="input-wrap">
                  <input value={peso(total)} readOnly style={{ fontWeight: 700, color: 'rgb(var(--primary-800))' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="dw-section">
            <h4>Object of Expenditure</h4>
            <div className="field">
              <label>Account Code</label>
              <PvDropdown
                options={SBPS_ACCOUNTS}
                optionLabel="name"
                optionValue="code"
                value={account}
                placeholder="Search accounts…"
                filterPlaceholder="Type code or name…"
                filter
                onChange={v => setAccount(v)}
              />
              {account && (
                <div className="field-hint" style={{ marginTop: 6 }}>
                  {acct.type === 'CO' ? 'Capital Outlay' : `MOOE — ${acct.sub ?? ''}`}
                </div>
              )}
            </div>
          </div>

          <div className="dw-section">
            <h4>Procurement &amp; Schedule</h4>
            <div className="field">
              <label>Procurement Method</label>
              <div className="input-wrap">
                <select value={proc} onChange={e => setProc(e.target.value)}>
                  {PROC_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Source of Funds</label>
                <div className="input-wrap">
                  <input value={src} onChange={e => setSrc(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Schedule</label>
                <div className="input-wrap">
                  <input value={sched} onChange={e => setSched(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="dw-section">
            <h4>Market Scoping</h4>
            <label className="check">
              <input type="checkbox" checked={scoping} onChange={e => setScoping(e.target.checked)} />
              <span>Scoping checklist complete (GPPB / NGPA-MS-2024-rev3)</span>
            </label>
            {scoping
              ? <div className="match-badge ok" style={{ width: 'fit-content' }}><i className="pi pi-check-circle" /> 7/7 items signed off</div>
              : <div className="match-badge bad" style={{ width: 'fit-content' }}><i className="pi pi-exclamation-circle" /> Required before submission</div>
            }
          </div>
        </div>

        {/* Footer */}
        <div className="dw-foot">
          <button className="btn danger-ghost" onClick={onClose}>
            <i className="pi pi-trash" /> Remove
          </button>
          <div style={{ flex: 1 }} />
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>
            <i className="pi pi-check" /> Save
          </button>
        </div>
      </aside>
    </>
  )
}
