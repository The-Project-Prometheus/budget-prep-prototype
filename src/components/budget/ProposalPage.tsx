'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { SBPS_PROPOSAL_LINES, sbpf1Total, sbpf2Total, proposalTotal, peso, pesoSm } from '@/lib/budget-data'

function SubmitModal({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  return (
    <>
      <div className="modal-scrim show" onClick={onClose} />
      <div className="modal show">
        <div className="modal-head">
          <div>
            <h3>Submit FY 2027 Budget Package</h3>
            <p>Routes Preparer → Director → Deputy Sec. → LBS. The system will block submission if any required document is missing or totals do not reconcile.</p>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>
        <div className="modal-body">
          <div className="warn-banner" style={{ margin: 0 }}>
            <i className="pi pi-check-circle" style={{ color: 'rgb(var(--success-600))' }} />
            <div>
              <b>All checks pass</b>
              PPMP ↔ SBPF1 totals match · 10/10 market scoping items signed · 1 IT-equipment item correctly flagged for PPS review.
            </div>
          </div>
          <div className="field">
            <label>Cover note to the Bureau Director</label>
            <textarea
              style={{ fontFamily: 'inherit', padding: 12, border: '1px solid rgb(var(--surface-300))', borderRadius: 8, minHeight: 80, resize: 'vertical', width: '100%' }}
              defaultValue="FY 2027 Committee on Finance budget package, with priority list for Capital Outlay (1: laptops, 2: copier, 3: filing cabinets)."
            />
          </div>
          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>I certify all entries comply with NBM No. 156 and R.A. 12009.</span>
          </label>
          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>I authorise routing to Deputy Sec. and LBS upon Director clearance.</span>
          </label>
        </div>
        <div className="modal-foot">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => { onClose(); toast('Package routed to Bureau Director.', 'pi-send') }}>
            <i className="pi pi-send" /> Submit &amp; Route
          </button>
        </div>
      </div>
    </>
  )
}

const SECTION_TITLES: Record<string, string> = {
  PS:   'I. Personnel Services',
  MOOE: 'II. Maint. & Other Operating Expenses (MOOE)',
  CO:   'III. Capital Outlays',
}

export default function ProposalPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [showSubmit, setShowSubmit] = useState(false)
  const toast = useToast()

  const sections = ['MOOE', 'CO'] as const
  let grandY25 = 0, grandY26 = 0, grandY27 = 0

  const tableRows = sections.flatMap(s => {
    const ls = SBPS_PROPOSAL_LINES.filter(l => l.type === s)
    if (!ls.length) return []
    const sY25 = ls.reduce((a, l) => a + l.y25, 0)
    const sY26 = ls.reduce((a, l) => a + l.y26, 0)
    const sY27 = ls.reduce((a, l) => a + l.y27, 0)
    grandY25 += sY25; grandY26 += sY26; grandY27 += sY27
    const sDelta = sY27 - sY26
    const sPct   = sY26 ? (sDelta / sY26 * 100) : 0

    return [
      <tr key={`sec-${s}`} className="section">
        <td colSpan={7}>{SECTION_TITLES[s]}</td>
      </tr>,
      ...ls.map(l => {
        const delta = l.y27 - l.y26
        const pct   = l.y26 ? (delta / l.y26 * 100) : 0
        const cls   = delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : 'delta-flat'
        const arr   = delta > 0 ? '▲' : delta < 0 ? '▼' : '—'
        return (
          <tr key={l.acct}>
            <td>
              {l.priority && <span className="priority-tag">{l.priority}</span>}
              <b>{l.acct}</b>
              {l.just && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontStyle: 'italic' }}>&ldquo;{l.just}&rdquo;</div>}
            </td>
            <td>{l.y25 ? pesoSm(l.y25) : '—'}</td>
            <td>{l.y26 ? pesoSm(l.y26) : '—'}</td>
            <td><b>{l.y27 ? pesoSm(l.y27) : '—'}</b></td>
            <td className={cls}>{arr} {pesoSm(Math.abs(delta))}</td>
            <td className={cls}>{pct.toFixed(1)}%</td>
            <td style={{ fontSize: 11, color: 'var(--fg-3)' }}>{l.remarks}</td>
          </tr>
        )
      }),
      <tr key={`sub-${s}`} className="subtotal">
        <td>Subtotal — {s}</td>
        <td>{pesoSm(sY25)}</td>
        <td>{pesoSm(sY26)}</td>
        <td>{pesoSm(sY27)}</td>
        <td className={sDelta >= 0 ? 'delta-up' : 'delta-down'}>{sDelta >= 0 ? '▲' : '▼'} {pesoSm(Math.abs(sDelta))}</td>
        <td className={sDelta >= 0 ? 'delta-up' : 'delta-down'}>{sPct.toFixed(1)}%</td>
        <td />
      </tr>,
    ]
  })

  const gDelta = grandY27 - grandY26
  const gPct   = grandY26 ? (gDelta / grandY26 * 100) : 0

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">FY 2027 Budget Proposal · Committee on Finance</div>
          <h1>Budget Proposal Summary</h1>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('Form printed.', 'pi-print')}>
            <i className="pi pi-print" /> Print Form
          </button>
          <button className="btn secondary" onClick={() => toast('Saved as draft.', 'pi-save')}>
            <i className="pi pi-save" /> Save Draft
          </button>
          <button className="btn primary" onClick={() => setShowSubmit(true)}>
            <i className="pi pi-send" /> Submit Package
          </button>
        </div>
      </div>

      <div className="split-2">
        {/* Variance table */}
        <div className="panel">
          <table className="var-table">
            <thead>
              <tr>
                <th className="l">Account</th>
                <th>Actual FY 2025</th>
                <th>Projection FY 2026</th>
                <th>Proposal FY 2027</th>
                <th>Increase / (Decrease)</th>
                <th>%</th>
                <th className="l" style={{ textAlign: 'left' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
              <tr className="total">
                <td>Grand Total — FY 2027 Proposal</td>
                <td>{pesoSm(grandY25)}</td>
                <td>{pesoSm(grandY26)}</td>
                <td>{pesoSm(grandY27)}</td>
                <td className={gDelta >= 0 ? 'delta-up' : 'delta-down'}>{gDelta >= 0 ? '▲' : '▼'} {pesoSm(Math.abs(gDelta))}</td>
                <td className={gDelta >= 0 ? 'delta-up' : 'delta-down'}>{gPct.toFixed(1)}%</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right rail */}
        <div>
          <div className="rail-card">
            <h4>Package Composition</h4>
            <div className="rail-row"><span>SBPF1 (PPMP-linked)</span><span className="v">{peso(sbpf1Total())}</span></div>
            <div className="rail-row"><span>SBPF2 (non-PPMP)</span><span className="v">{peso(sbpf2Total())}</span></div>
            <div className="rail-row"><span>Total Proposal FY 2027</span><span className="v">{peso(proposalTotal())}</span></div>
          </div>

          <div className="rail-card">
            <h4>Required Documents</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                ['PPMP FY 2027', 'sbps-ppmp'],
                ['Market Scoping (10/10)', null],
                ['SBPF1', 'sbps-sbpf1'],
                ['SBPF2', 'sbps-sbpf2'],
              ].map(([label, page]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><i className="pi pi-check-circle" style={{ color: 'rgb(var(--success-600))' }} /> {label}</span>
                  {page
                    ? <button className="textlink" onClick={() => onNavigate(page as string)}>View</button>
                    : <button className="textlink" onClick={() => toast('Checklist opened.', 'pi-list-check')}>View</button>
                  }
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><i className="pi pi-check-circle" style={{ color: 'rgb(var(--success-600))' }} /> Proposal Summary</span>
                <span style={{ color: 'var(--fg-3)', fontSize: 11 }}>This page</span>
              </div>
            </div>
          </div>

          <div className="rail-card">
            <h4>Routing on submission</h4>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-2)' }}>
              1. <b>Bureau Director</b> — for office-level clearance<br />
              2. <b>Deputy Secretary</b> — higher approval<br />
              3. <b>Legislative Budget Service (LBS)</b> — evaluation
            </div>
          </div>
        </div>
      </div>

      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
    </>
  )
}
