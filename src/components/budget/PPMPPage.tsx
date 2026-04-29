'use client'

import { useState } from 'react'
import {
  SBPS_PPMP_ITEMS, PPMP_CAT_LABELS, accountByCode,
  ppmpSubtotal, ppmpBuffered, peso, pesoSm,
} from '@/lib/budget-data'
import { useToast } from '@/components/ui/Toast'
import PPMPItemDrawer from './PPMPItemDrawer'

type Cat = 'ALL' | 'CUS' | 'SUPP' | 'PROJ'

export default function PPMPPage() {
  const [catFilter, setCatFilter] = useState<Cat>('ALL')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const toast = useToast()

  const subTot     = ppmpSubtotal()
  const buffered   = ppmpBuffered()
  const scopingDone = SBPS_PPMP_ITEMS.filter(i => i.scoping).length
  const items      = SBPS_PPMP_ITEMS

  const groups = (['CUS', 'SUPP', 'PROJ'] as const).map(cat => ({
    cat,
    label: PPMP_CAT_LABELS[cat],
    items: items.filter(i => i.cat === cat),
    total: items.filter(i => i.cat === cat).reduce((s, i) => s + i.qty * i.unit_cost, 0),
  })).filter(g => g.items.length)

  const procChip = (proc: string) =>
    proc === 'Competitive Bidding' ? 'in-review' : proc === 'Small Value' ? 'pending' : 'approved'

  const drawerItem = selectedItem ? items.find(i => i.id === selectedItem) ?? null : null

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">PPMP · FY 2027 · {items.length} items · Committee on Finance</div>
          <h1>Project Procurement Mgmt. Plan</h1>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('PPMP printed.', 'pi-print')}>
            <i className="pi pi-print" /> Print
          </button>
          <button className="btn secondary" onClick={() => toast('Scoping checklist downloaded.', 'pi-download')}>
            <i className="pi pi-list-check" /> Market Scoping
          </button>
          <button className="btn primary" onClick={() => toast('Item added — fill details in drawer.', 'pi-plus')}>
            <i className="pi pi-plus" /> Add Item
          </button>
        </div>
      </div>

      {/* Totals bar */}
      <div className="totals-bar">
        <div className="totals-cell">
          <div className="totals-lbl">PPMP Subtotal</div>
          <div className="totals-val"><span className="peso">₱</span>{pesoSm(subTot)}</div>
          <div className="totals-sub">{items.length} line items · excl. 10% buffer</div>
        </div>
        <div className="totals-cell">
          <div className="totals-lbl">10% Buffer</div>
          <div className="totals-val"><span className="peso">₱</span>{pesoSm(buffered - subTot)}</div>
          <div className="totals-sub">For procurement contingencies</div>
        </div>
        <div className="totals-cell">
          <div className="totals-lbl">PPMP Total (incl. buffer)</div>
          <div className="totals-val"><span className="peso">₱</span>{pesoSm(buffered)}</div>
          <div className="totals-sub">Submitted to PPMS · 15 Apr 2026</div>
        </div>
        <div className="totals-cell match">
          <div className="totals-lbl">Market Scoping</div>
          <div className="totals-val">
            {scopingDone}<span style={{ color: 'rgb(var(--primary-200))' }}>/{items.length}</span>
          </div>
          <div className="totals-sub">
            {scopingDone === items.length ? 'Complete · ready for SBPF1' : 'Required before submission'}
          </div>
        </div>
      </div>

      <div className="warn-banner" style={{ background: 'rgb(var(--primary-50))', borderColor: 'rgb(var(--primary-200))', color: 'var(--fg-1)' }}>
        <i className="pi pi-info-circle" style={{ color: 'rgb(var(--primary-600))' }} />
        <div>
          <b>PPMP ↔ SBPF1 reconciliation rule</b>
          Total PPMP <i>excluding</i> the 10% buffer (<b>{peso(subTot)}</b>) must equal SBPF1 total.
          The system will block submission of the budget package if these do not match.
        </div>
      </div>

      <div className="panel">
        <div className="filter-row">
          <div className="search-box" style={{ maxWidth: 360, background: 'rgb(var(--surface-50))', marginLeft: 0 }}>
            <i className="pi pi-search" />
            <input placeholder="Search items, accounts, procurement method…" />
          </div>
          <div className="seg">
            {(['ALL', 'CUS', 'SUPP', 'PROJ'] as Cat[]).map(c => (
              <button key={c} className={catFilter === c ? 'on' : ''} onClick={() => setCatFilter(c)}>
                {c === 'ALL' ? 'All' : c === 'CUS' ? 'Common-Use' : c === 'SUPP' ? 'Supplementary' : 'Projects'}{' '}
                <span className="pill-count">
                  {c === 'ALL' ? items.length : items.filter(i => i.cat === c).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Item No.</th><th>General Description</th>
              <th className="amt">Qty</th><th>Unit</th>
              <th className="amt">Unit Cost</th><th className="amt">Total Cost</th>
              <th>Account</th><th>Procurement</th><th>Scoping</th>
            </tr>
          </thead>
          <tbody>
            {groups.filter(g => catFilter === 'ALL' || g.cat === catFilter).map(g => (
              <>
                <tr key={`grp-${g.cat}`} className="ppmp-cat-row">
                  <td colSpan={9}>
                    <span className="cat-pill">{g.cat}</span>
                    {g.label} ·{' '}
                    <span style={{ color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', textTransform: 'none', letterSpacing: 0 }}>
                      {peso(g.total)}
                    </span>
                  </td>
                </tr>
                {g.items.map(item => {
                  const acct = accountByCode(item.account)
                  const total = item.qty * item.unit_cost
                  return (
                    <tr key={item.id} onClick={() => setSelectedItem(item.id)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{item.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.desc}</div>
                        {item.flag && (
                          <div style={{ fontSize: 11, color: 'rgb(var(--warn-700))', marginTop: 2 }}>
                            <i className="pi pi-flag-fill" /> Flagged for {item.flag}
                          </div>
                        )}
                      </td>
                      <td className="qty">{item.qty}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', fontSize: 12 }}>{item.unit}</td>
                      <td className="amt">{pesoSm(item.unit_cost)}</td>
                      <td className="amt">{pesoSm(total)}</td>
                      <td>
                        <div className="acct-cell">
                          <span className="acct-code">{acct.code}</span>
                          <span className="acct-name">{acct.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`chip ${procChip(item.proc)}`}>
                          <span className="cdot" />{item.proc}
                        </span>
                      </td>
                      <td>
                        {item.scoping
                          ? <span className="chip approved"><span className="cdot" />Scoped</span>
                          : <span className="chip pending"><span className="cdot" />Pending</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {drawerItem && (
        <PPMPItemDrawer item={drawerItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  )
}
