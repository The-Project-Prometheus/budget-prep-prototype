'use client'

import { useToast } from '@/components/ui/Toast'
import { SBPS_SBPF2_LINES, accountByCode, sbpf2Total, peso, pesoSm } from '@/lib/budget-data'

const ACCOUNT_HINTS = [
  ['Alcohol',      '5-02-03-070'],
  ['Desk Fan',     '5-02-03-210'],
  ['Laptop',       '1-07-05-030 · flagged for PPS'],
  ['Toner',        '5-02-03-050'],
  ['Janitorial',   '5-02-12-010 · centralized'],
  ['Training',     '5-02-02-010 · HRMS only'],
]

export default function SBPF2Page() {
  const toast = useToast()
  const total = sbpf2Total()

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">SBPF2 · FY 2027 · Non-PPMP Items</div>
          <h1>Senate Budget Preparation Form 2</h1>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('SBPF2 exported.', 'pi-download')}>
            <i className="pi pi-download" /> Export
          </button>
          <button className="btn primary" onClick={() => toast('Add line — auto-suggest opens.', 'pi-plus')}>
            <i className="pi pi-plus" /> Add Line
          </button>
        </div>
      </div>

      <div className="warn-banner">
        <i className="pi pi-info-circle" />
        <div>
          <b>What goes in SBPF2?</b>
          Items / projects that <i>cannot</i> be procurement-planned in advance — subscriptions, honoraria,
          foreign-mission travel, conference fees. Each line requires a written justification. The system
          auto-suggests an account code based on your description.
        </div>
      </div>

      <div className="panel">
        <div className="filter-row">
          <div className="search-box" style={{ maxWidth: 360, background: 'rgb(var(--surface-50))', marginLeft: 0 }}>
            <i className="pi pi-search" />
            <input placeholder="Search lines, accounts, justifications…" />
          </div>
          <div style={{ flex: 1 }} />
          <span className="match-badge ok">
            <i className="pi pi-info-circle" /> {SBPS_SBPF2_LINES.length} lines · {peso(total)}
          </span>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Line</th>
              <th>Description &amp; Justification</th>
              <th>Account</th>
              <th className="amt">Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {SBPS_SBPF2_LINES.map(l => {
              const acct = accountByCode(l.account)
              return (
                <tr key={l.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{l.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.desc}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontStyle: 'italic', lineHeight: 1.4 }}>
                      &ldquo;{l.just}&rdquo;
                    </div>
                  </td>
                  <td>
                    <div className="acct-cell">
                      <span className="acct-code">{acct.code}</span>
                      <span className="acct-name">{acct.name}</span>
                    </div>
                  </td>
                  <td className="amt">{pesoSm(l.amount)}</td>
                  <td>
                    <div className="row-actions" style={{ opacity: 1 }}>
                      <button title="Edit" onClick={() => toast('Edit line.', 'pi-pencil')}>
                        <i className="pi pi-pencil" />
                      </button>
                      <button title="Remove" onClick={() => toast('Line removed.', 'pi-trash')}>
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgb(var(--primary-900))', color: 'white' }}>
              <td colSpan={3} style={{ textAlign: 'right', padding: 14, fontFamily: 'var(--font-menu)', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                SBPF2 Total
              </td>
              <td className="amt" style={{ padding: 14, fontSize: 16, color: 'rgb(var(--accent-300))' }}>
                {peso(total)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="sec-head">
        <h2>Account Auto-Suggest</h2>
        <div className="meta">From the Revised Guide for Categories of Items</div>
      </div>
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 14 }}>
          Type a keyword to see how the system maps items to accounts.
          The same logic runs as you fill new SBPF2 lines.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {ACCOUNT_HINTS.map(([kw, code]) => (
            <div key={kw} style={{ padding: '10px 12px', border: '1px solid rgb(var(--surface-200))', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{kw}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgb(var(--primary-700))' }}>
                <i className="pi pi-arrow-right" style={{ fontSize: 9 }} /> {code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
