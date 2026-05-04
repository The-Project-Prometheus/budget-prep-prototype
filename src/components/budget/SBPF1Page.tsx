'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { SBPS_PPMP_ITEMS, accountByCode, ppmpSubtotal, sbpf1Total, peso, pesoSm, type PPMPItem } from '@/lib/budget-data'
import SBPF1EditDrawer from './SBPF1EditDrawer'

export default function SBPF1Page({ onNavigate }: { onNavigate: (p: string) => void }) {
  const toast = useToast()
  const [editItem, setEditItem] = useState<PPMPItem | null>(null)
  const subTot   = ppmpSubtotal()
  const sbpfTot  = sbpf1Total()
  const matches  = subTot === sbpfTot

  // Group by account
  const byAcct: Record<string, { acct: ReturnType<typeof accountByCode>; items: typeof SBPS_PPMP_ITEMS; total: number }> = {}
  SBPS_PPMP_ITEMS.forEach(i => {
    if (!byAcct[i.account]) byAcct[i.account] = { acct: accountByCode(i.account), items: [], total: 0 }
    byAcct[i.account].items.push(i)
    byAcct[i.account].total += i.qty * i.unit_cost
  })

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">SBPF1 · FY 2027 · Items in PPMP</div>
          <h1>Senate Budget Preparation Form 1</h1>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('SBPF1 exported.', 'pi-download')}>
            <i className="pi pi-download" /> Export
          </button>
          <button className="btn primary" onClick={() => onNavigate('sbps-sbpf2')}>
            <i className="pi pi-arrow-right" /> Continue to SBPF2
          </button>
        </div>
      </div>

      <div className="totals-bar">
        <div className="totals-cell">
          <div className="totals-lbl">PPMP Subtotal (excl. buffer)</div>
          <div className="totals-val"><span className="peso">₱</span>{pesoSm(subTot)}</div>
          <div className="totals-sub">From approved PPMP · {SBPS_PPMP_ITEMS.length} items</div>
        </div>
        <div className={`totals-cell${matches ? ' match' : ''}`}>
          <div className="totals-lbl">SBPF1 Total</div>
          <div className="totals-val"><span className="peso">₱</span>{pesoSm(sbpfTot)}</div>
          <div className="totals-sub">{matches ? '✓ Matches PPMP' : '✗ Mismatch — submission blocked'}</div>
        </div>
        <div className="totals-cell">
          <div className="totals-lbl">Variance</div>
          <div className="totals-val" style={{ color: 'rgb(var(--accent-300))' }}>₱0</div>
          <div className="totals-sub">PPMP – SBPF1 = ₱0</div>
        </div>
        <div className="totals-cell">
          <div className="totals-lbl">Status</div>
          <div className="totals-val" style={{ fontSize: 16, paddingTop: 4 }}>
            {matches
              ? <span className="match-badge ok"><i className="pi pi-check-circle" /> Ready</span>
              : <span className="match-badge bad"><i className="pi pi-times-circle" /> Blocked</span>
            }
          </div>
          <div className="totals-sub">{matches ? 'Cleared for submission' : 'Resolve PPMP discrepancy'}</div>
        </div>
      </div>

      <div className="panel">
        <div className="filter-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-2)' }}>
            <i className="pi pi-link" style={{ color: 'rgb(var(--primary-600))' }} />
            Lines below are auto-pulled from your approved{' '}
            <button className="textlink" onClick={() => onNavigate('sbps-ppmp')}>FY 2027 PPMP</button>.
            Edit lines in PPMP to update SBPF1.
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Item No.</th><th>Description</th>
              <th className="amt">Qty</th><th>Unit</th>
              <th className="amt">Unit Cost</th><th className="amt">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(byAcct).map(g => (
              <>
                <tr key={`grp-${g.acct.code}`} className="ppmp-cat-row">
                  <td colSpan={6}>
                    <span className="cat-pill">{g.acct.code}</span>
                    {g.acct.name} ·{' '}
                    <span style={{ color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', textTransform: 'none', letterSpacing: 0 }}>
                      {peso(g.total)}
                    </span>
                  </td>
                </tr>
                {g.items.map(i => (
                  <tr key={i.id} onClick={() => setEditItem(i)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{i.id}</td>
                    <td>{i.desc}</td>
                    <td className="qty">{i.qty}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', fontSize: 12 }}>{i.unit}</td>
                    <td className="amt">{pesoSm(i.unit_cost)}</td>
                    <td className="amt">{pesoSm(i.qty * i.unit_cost)}</td>
                    <td style={{ width: 80 }}>
                      <div className="row-actions">
                        <button title="Edit" onClick={e => { e.stopPropagation(); setEditItem(i) }}>
                          <i className="pi pi-pencil" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgb(var(--primary-900))', color: 'white' }}>
              <td colSpan={6} style={{ textAlign: 'right', padding: 14, fontFamily: 'var(--font-menu)', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                SBPF1 Total
              </td>
              <td className="amt" style={{ padding: 14, fontSize: 16, color: 'rgb(var(--accent-300))' }}>
                {peso(sbpfTot)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {editItem && (
        <SBPF1EditDrawer
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={(updated) => {
            // In a real app, this would update the store; prototype just shows toast
            toast(`${updated.id} updated.`, 'pi-check-circle')
            setEditItem(null)
          }}
        />
      )}
    </>
  )
}
