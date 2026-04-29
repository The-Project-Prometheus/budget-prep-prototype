'use client'

import { useToast } from '@/components/ui/Toast'
import { peso, avatarInitials, type ApprovalPackage } from '@/lib/budget-data'

interface Props { pkg: ApprovalPackage; onClose: () => void }

function avatarBg(hue: number) { return `hsl(${hue}, 52%, 42%)` }

const STAGE_NAMES = ['Preparer', 'Director', 'Deputy Sec.', 'LBS']

export default function ApprovalDrawer({ pkg, onClose }: Props) {
  const toast = useToast()

  const stageIndex = (stage: string) => {
    if (stage === 'Director')       return 1
    if (stage === 'Deputy Sec.')    return 2
    if (['LBS Evaluation','LBS Approved'].includes(stage)) return 3
    return 0
  }
  const currentIdx = stageIndex(pkg.stage)

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <aside className="drawer show">
        <div className="dw-head">
          <div className="u-ava" style={{ background: avatarBg(pkg.hue), width: 48, height: 48, fontSize: 15, borderRadius: 10 }}>
            {avatarInitials(pkg.preparer)}
          </div>
          <div style={{ flex: 1 }}>
            <div className="sub" style={{ fontSize: 11 }}>Budget Package · {pkg.id}</div>
            <h3>{pkg.office}</h3>
            <div className="sub">FY 2027 · prepared by {pkg.preparer} · submitted {pkg.submitted}</div>
            <div className="chips">
              <span className={`chip ${pkg.status}`}><span className="cdot" />{pkg.stage}</span>
              <span className="role-tag reviewer"><i className="pi pi-tag" /> {peso(pkg.total)}</span>
            </div>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        <div className="dw-body">
          <div className="dw-pane">
            {/* Stage tracker */}
            <div className="dw-section">
              <h4>Routing</h4>
              <div className="stages">
                {STAGE_NAMES.map((name, i) => {
                  const done    = i < currentIdx || pkg.stage === 'LBS Approved'
                  const current = i === currentIdx && pkg.stage !== 'LBS Approved'
                  return (
                    <>
                      <div key={name} className={`stage${done ? ' done' : current ? ' current' : ''}`}>
                        <div className="stage-num">{done ? '✓' : i + 1}</div>
                        <div className="stage-name">{name}</div>
                      </div>
                      {i < STAGE_NAMES.length - 1 && (
                        <div key={`bar-${i}`} className={`stage-bar${done ? ' done' : ''}`} />
                      )}
                    </>
                  )
                })}
              </div>
            </div>

            {/* Package contents */}
            <div className="dw-section">
              <h4>Package Contents</h4>
              <div className="perm-grid">
                {[
                  ['PPMP FY 2027',          '10 line items · 10/10 market scoping checklist signed'],
                  ['SBPF1',                  'Linked to PPMP · totals reconcile (₱0 variance)'],
                  ['SBPF2',                  '3 non-PPMP lines with justifications'],
                  ['Budget Proposal Summary','Variance analysis FY25 → FY26 → FY27'],
                ].map(([name, desc]) => (
                  <div key={name} className="perm perm-on">
                    <i className="pi pi-check-circle perm-check" />
                    <div style={{ flex: 1 }}>
                      <div className="perm-name">{name}</div>
                      <div className="perm-desc">{desc}</div>
                    </div>
                    <button className="textlink">Open</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Variance snapshot */}
            <div className="dw-section">
              <h4>Variance Snapshot</h4>
              <dl className="kv-grid">
                <dt>FY 25 Actual</dt>      <dd className="mono">{peso(Math.round(pkg.total * 0.78))}</dd>
                <dt>FY 26 Projection</dt>  <dd className="mono">{peso(Math.round(pkg.total * 0.92))}</dd>
                <dt>FY 27 Proposal</dt>    <dd className="mono"><b>{peso(pkg.total)}</b></dd>
                <dt>Increase</dt>          <dd><span className="delta-up">▲ {peso(Math.round(pkg.total * 0.08))} (+8.7%)</span></dd>
              </dl>
            </div>

            {/* LBS evaluator comments */}
            <div className="dw-section">
              <h4>LBS Evaluator Comments</h4>
              <textarea
                style={{ width: '100%', fontFamily: 'inherit', padding: 12, border: '1px solid rgb(var(--surface-300))', borderRadius: 8, minHeight: 90, resize: 'vertical' }}
                defaultValue="Reviewed FY27 vs FY26 projection. Capital Outlay priority list is well-justified; recommend routing IT line to PPS for cost benchmarking."
              />
            </div>
          </div>
        </div>

        <div className="dw-foot">
          <button className="btn secondary" onClick={onClose}>Close</button>
          <button className="btn danger-ghost" onClick={() => { onClose(); toast(`Returned to ${pkg.office} for revision.`, 'pi-undo') }}>
            <i className="pi pi-undo" /> Return for Revision
          </button>
          <button className="btn primary" onClick={() => { onClose(); toast(`${pkg.id} approved.`, 'pi-check-circle') }}>
            <i className="pi pi-check" /> Approve
          </button>
        </div>
      </aside>
    </>
  )
}
