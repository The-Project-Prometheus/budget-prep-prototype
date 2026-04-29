'use client'

import { useToast } from '@/components/ui/Toast'
import {
  SBPS_CALENDAR, SBPS_DASHBOARD_DERIVED,
  ppmpSubtotal, sbpf1Total, sbpf2Total, proposalTotal, peso, pesoSm,
} from '@/lib/budget-data'

export default function BudgetDashPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const toast = useToast()

  const subTot = ppmpSubtotal()
  const prop   = proposalTotal()

  // derive from proposal lines
  const fy25 = SBPS_DASHBOARD_DERIVED.fy25
  const fy26 = SBPS_DASHBOARD_DERIVED.fy26
  const pct  = ((prop - fy26) / fy26 * 100)
  const max  = Math.max(fy25, fy26, prop) * 1.15
  const split = (t: number) => ({ mooe: Math.round(t * 0.81), co: Math.round(t * 0.19) })
  const c25 = split(fy25), c26 = split(fy26), c27 = split(prop)
  const barH = (v: number) => Math.round((v / max) * 160)

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">FY 2027 Budget Preparation · Committee on Finance</div>
          <h1>Budget Preparation Dashboard</h1>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => toast('Calendar exported.', 'pi-download')}>
            <i className="pi pi-calendar" /> Calendar
          </button>
          <button className="btn primary" onClick={() => onNavigate('sbps-proposal')}>
            <i className="pi pi-arrow-right" /> Continue Proposal
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="stat-strip">
        <div className="stat">
          <div className="lbl">PPMP submitted <i className="pi pi-list" /></div>
          <div className="val" style={{ fontSize: 20 }}>{peso(subTot)}</div>
          <div className="sub">10 line items · excl. 10% buffer</div>
        </div>
        <div className="stat invert">
          <div className="lbl">FY 2027 Proposal <i className="pi pi-flag" /></div>
          <div className="val" style={{ fontSize: 20 }}>{peso(prop)}</div>
          <div className="sub">SBPF1 {peso(sbpf1Total())} + SBPF2 {peso(sbpf2Total())}</div>
        </div>
        <div className="stat">
          <div className="lbl">vs FY26 projection <i className={`pi ${pct >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'}`} /></div>
          <div className="val" style={{ color: `rgb(var(--${pct >= 0 ? 'success-700' : 'error-700'}))` }}>
            {pct >= 0 ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
          </div>
          <div className="sub">{peso(Math.abs(prop - fy26))} variance</div>
        </div>
        <div className="stat">
          <div className="lbl">Pending approvals <i className="pi pi-inbox" /></div>
          <div className="val">2<span style={{ fontSize: 14, color: 'var(--fg-3)', fontWeight: 500 }}> / 6</span></div>
          <div className="sub">1 returned · 2 centralization flags</div>
        </div>
      </div>

      <div className="split-2">
        <div>
          {/* Bar chart */}
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="head">
              <h3>Variance — FY 2025 Actual vs FY 2026 Projection vs FY 2027 Proposal</h3>
              <span className="pill-count">Committee on Finance</span>
            </div>
            <div className="barchart">
              {[
                { label: 'FY 2025 Actual',      mooe: c25.mooe, co: c25.co, total: fy25 },
                { label: 'FY 2026 Projection',   mooe: c26.mooe, co: c26.co, total: fy26 },
                { label: 'FY 2027 Proposal',     mooe: c27.mooe, co: c27.co, total: prop },
              ].map(bar => (
                <div key={bar.label} className="bar-col">
                  <div className="bar-stack" style={{ height: barH(bar.mooe) + barH(bar.co) }}>
                    <div className="bar-seg co"   style={{ height: barH(bar.co) }} />
                    <div className="bar-seg mooe" style={{ height: barH(bar.mooe) }} />
                  </div>
                  <div className="bar-value">{peso(bar.total)}</div>
                  <div className="bar-label">{bar.label}</div>
                </div>
              ))}
            </div>
            <div className="bar-legend">
              <span className="l-mooe">MOOE</span>
              <span className="l-co">Capital Outlays</span>
              <span className="l-ps">Personnel Services</span>
            </div>
          </div>

          {/* Compliance flags */}
          <div className="sec-head">
            <h2>Centralization &amp; compliance flags</h2>
            <div className="meta">Auto-detected against your PPMP/SBPF entries</div>
          </div>
          <div className="warn-banner">
            <i className="pi pi-exclamation-triangle" />
            <div>
              <b>1 item flagged for PPS / EDP-MIS review</b>
              6 × Laptops (PI-008) — IT Equipment proposals are routed through PPS for technical
              evaluation before LBS submission.
            </div>
          </div>
          <div className="warn-banner">
            <i className="pi pi-info-circle" />
            <div>
              <b>Training Expenses correctly excluded</b>
              FY 2027 budget for Training is centralized to HRMS. ₱0 reflected in your Budget Proposal — no action required.
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="panel">
          <div className="head"><h3>Senate Budget Preparation Calendar</h3></div>
          <div className="cal-list">
            {SBPS_CALENDAR.map((c, i) => (
              <div key={i} className={`cal-row${c.current ? ' current' : ''}`}>
                <div className="cal-date">{c.d}</div>
                <div className={`cal-dot${c.done ? ' done' : ''}${c.current ? ' current' : ''}`} />
                <div>
                  <div className="cal-task">{c.t}</div>
                  <div className="cal-owner">Owner: {c.owner}</div>
                </div>
                <div>
                  {c.done
                    ? <span className="chip approved"><span className="cdot" />Done</span>
                    : c.current
                      ? <span className="chip in-review"><span className="cdot" />In progress</span>
                      : <span className="chip pending"><span className="cdot" />Upcoming</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
