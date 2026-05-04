'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { SBPS_SBPF2_LINES, accountByCode, sbpf2Total, peso, pesoSm, type SBPF2Line } from '@/lib/budget-data'
import SBPF2EditDrawer from './SBPF2EditDrawer'

const ACCOUNT_HINTS = [
  ['Journal / Research',  '5-02-99-010'],
  ['Foreign Travel',      '5-02-04-020'],
  ['Conference Dues',     '5-02-99-040'],
  ['Local Travel',        '5-02-04-010'],
  ['Janitorial',          '5-02-12-010 · centralized'],
  ['Training',            '5-02-02-010 · HRMS only'],
]

export default function SBPF2Page() {
  const toast = useToast()
  const [lines, setLines]       = useState<SBPF2Line[]>(SBPS_SBPF2_LINES)
  const [editLine, setEditLine] = useState<SBPF2Line | null | 'new'>( null)

  const total = lines.reduce((s, l) => s + l.amount, 0)

  function handleSave(saved: SBPF2Line) {
    setLines(prev => {
      const idx = prev.findIndex(l => l.id === saved.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next }
      return [...prev, saved]
    })
  }

  function handleRemove(id: string) {
    setLines(prev => prev.filter(l => l.id !== id))
  }

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
          <button className="btn primary" onClick={() => setEditLine('new')}>
            <i className="pi pi-plus" /> Add Line
          </button>
        </div>
      </div>

      <div className="warn-banner">
        <i className="pi pi-info-circle" />
        <div>
          <b>What goes in SBPF2?</b>
          Items that <i>cannot</i> be procurement-planned in advance — subscriptions, honoraria,
          foreign-mission travel, conference fees. Each line requires a written justification.
          The system auto-suggests an account code from your description.
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
            <i className="pi pi-info-circle" /> {lines.length} lines · {peso(total)}
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
            {lines.map(l => {
              const acct = accountByCode(l.account)
              return (
                <tr key={l.id} onClick={() => setEditLine(l)} style={{ cursor: 'pointer' }}>
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
                      <button title="Edit" onClick={e => { e.stopPropagation(); setEditLine(l) }}>
                        <i className="pi pi-pencil" />
                      </button>
                      <button title="Remove" onClick={e => { e.stopPropagation(); handleRemove(l.id); toast('Line removed.', 'pi-trash') }}>
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

      {/* Account auto-suggest panel */}
      <div className="sec-head">
        <h2>Account Auto-Suggest</h2>
        <div className="meta">From the Revised Guide for Categories of Items</div>
      </div>
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 14 }}>
          Type a keyword when adding a line — the drawer suggests the account code automatically.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
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

      {/* Edit / Add drawer */}
      {editLine !== null && (
        <SBPF2EditDrawer
          line={editLine === 'new' ? null : editLine}
          onClose={() => setEditLine(null)}
          onSave={handleSave}
          onRemove={handleRemove}
        />
      )}
    </>
  )
}
