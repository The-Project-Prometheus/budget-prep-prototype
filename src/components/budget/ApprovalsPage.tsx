'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { SBPS_APPROVALS, avatarInitials, peso, type ApprovalPackage } from '@/lib/budget-data'
import ApprovalDrawer from './ApprovalDrawer'

function avatarBg(hue: number) { return `hsl(${hue}, 52%, 42%)` }

export default function ApprovalsPage() {
  const [selected, setSelected] = useState<ApprovalPackage | null>(null)
  const toast = useToast()
  const pkgs = SBPS_APPROVALS

  const cnt = {
    pending:  pkgs.filter(p => p.status === 'pending').length,
    review:   pkgs.filter(p => p.status === 'in-review').length,
    returned: pkgs.filter(p => p.status === 'returned').length,
    approved: pkgs.filter(p => p.status === 'approved').length,
  }

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">LBS Evaluator · {pkgs.length} Packages</div>
          <h1>Approvals Inbox</h1>
        </div>
        <div className="actions">
          <button className="btn secondary"><i className="pi pi-filter" /> Filter</button>
          <button className="btn secondary" onClick={() => toast('Bulk export queued.', 'pi-download')}>
            <i className="pi pi-download" /> Export
          </button>
        </div>
      </div>

      <div className="stat-strip">
        <div className="stat">
          <div className="lbl">Pending review <i className="pi pi-inbox" /></div>
          <div className="val">{cnt.pending}</div>
          <div className="sub">Newly submitted to LBS</div>
        </div>
        <div className="stat invert">
          <div className="lbl">In review <i className="pi pi-eye" /></div>
          <div className="val">{cnt.review}</div>
          <div className="sub">Open with reviewer</div>
        </div>
        <div className="stat">
          <div className="lbl">Returned <i className="pi pi-undo" style={{ color: 'rgb(var(--error-500))' }} /></div>
          <div className="val">{cnt.returned}</div>
          <div className="sub">Awaiting office revision</div>
        </div>
        <div className="stat accent">
          <div className="lbl">Approved <i className="pi pi-check-circle" /></div>
          <div className="val">{cnt.approved}</div>
          <div className="sub">Cleared to consolidation</div>
        </div>
      </div>

      <div className="panel">
        <div className="filter-row">
          <div className="search-box" style={{ maxWidth: 360, background: 'rgb(var(--surface-50))', marginLeft: 0 }}>
            <i className="pi pi-search" />
            <input placeholder="Search by office, package, preparer…" />
          </div>
          <div className="seg">
            <button className="on">All <span className="pill-count">{pkgs.length}</span></button>
            <button>Pending <span className="pill-count">{cnt.pending}</span></button>
            <button>In review <span className="pill-count">{cnt.review}</span></button>
            <button>Returned <span className="pill-count">{cnt.returned}</span></button>
            <button>Approved <span className="pill-count">{cnt.approved}</span></button>
          </div>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}><input type="checkbox" /></th>
              <th>Office &amp; Package</th>
              <th>Stage</th>
              <th className="amt">Total</th>
              <th>Submitted</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pkgs.map(p => (
              <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                <td><input type="checkbox" onClick={e => e.stopPropagation()} /></td>
                <td>
                  <div className="u-cell">
                    <div className="u-ava" style={{ background: avatarBg(p.hue), width: 32, height: 32, fontSize: 11 }}>
                      {avatarInitials(p.preparer)}
                    </div>
                    <div>
                      <div className="u-name">{p.office}</div>
                      <div className="u-email">{p.id} · prepared by {p.preparer}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`chip ${p.status}`}><span className="cdot" />{p.stage}</span></td>
                <td className="amt">{peso(p.total)}</td>
                <td style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.submitted}</td>
                <td>
                  <div className="row-actions">
                    <button title="Open" onClick={e => { e.stopPropagation(); setSelected(p) }}>
                      <i className="pi pi-eye" />
                    </button>
                    <button title="Approve" onClick={e => { e.stopPropagation(); toast(`Approved ${p.id}`, 'pi-check') }}>
                      <i className="pi pi-check" />
                    </button>
                    <button title="Return" onClick={e => { e.stopPropagation(); toast('Returned for revision', 'pi-undo') }}>
                      <i className="pi pi-undo" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <ApprovalDrawer pkg={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
