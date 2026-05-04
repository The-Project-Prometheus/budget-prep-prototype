'use client'

import { useState } from 'react'
import { SBPS_ACCOUNTS, accountByCode, type SBPF2Line } from '@/lib/budget-data'
import { useToast } from '@/components/ui/Toast'
import PvDropdown from '@/components/ui/PvDropdown'

interface Props {
  line?: SBPF2Line | null   // null = add new
  onClose: () => void
  onSave: (line: SBPF2Line) => void
  onRemove?: (id: string) => void
}

// Simple keyword → account auto-suggest
const KEYWORD_MAP: { kw: string[]; code: string }[] = [
  { kw: ['journal','subscription','periodical','lexis','imf','database'],       code: '5-02-99-010' },
  { kw: ['foreign','mission','travel','itu','ipu','asean','abroad'],            code: '5-02-04-020' },
  { kw: ['conference','fee','appf','aipa','dues','membership'],                 code: '5-02-99-040' },
  { kw: ['local travel','field','hearing','region'],                            code: '5-02-04-010' },
  { kw: ['food','meals','catering','board'],                                    code: '5-02-03-070' },
]

function autoSuggest(desc: string): string | null {
  const lower = desc.toLowerCase()
  for (const { kw, code } of KEYWORD_MAP) {
    if (kw.some(k => lower.includes(k))) return code
  }
  return null
}

const MIN_JUST = 20

export default function SBPF2EditDrawer({ line, onClose, onSave, onRemove }: Props) {
  const toast = useToast()
  const isNew = !line

  const [desc, setDesc]     = useState(line?.desc ?? '')
  const [just, setJust]     = useState(line?.just ?? '')
  const [account, setAccount] = useState(line?.account ?? '')
  const [amount, setAmount] = useState(line?.amount ?? 0)
  const [certComplies, setCertComplies] = useState(true)
  const [certAuth, setCertAuth]         = useState(true)

  const justOk  = just.length >= MIN_JUST
  const acct    = account ? accountByCode(account) : null

  // Auto-suggest account from description
  function handleDescChange(val: string) {
    setDesc(val)
    const suggested = autoSuggest(val)
    if (suggested && !account) setAccount(suggested)
  }

  function handleSave() {
    if (!desc.trim()) { toast('Description is required.', 'pi-exclamation-circle'); return }
    if (!justOk)      { toast('Justification must be at least 20 characters.', 'pi-exclamation-circle'); return }
    if (!account)     { toast('Select an account code.', 'pi-exclamation-circle'); return }
    if (!amount)      { toast('Enter an amount.', 'pi-exclamation-circle'); return }

    const saved: SBPF2Line = {
      id:      line?.id ?? `L2-${Date.now()}`,
      desc:    desc.trim(),
      just:    just.trim(),
      account,
      amount,
    }
    onSave(saved)
    onClose()
    toast(isNew ? 'Line added.' : 'Line updated.', 'pi-check-circle')
  }

  return (
    <>
      <div className="scrim show" onClick={onClose} />
      <aside className="drawer show">
        {/* Head */}
        <div className="dw-head">
          <div style={{ flex: 1 }}>
            <div className="sub">{isNew ? 'New SBPF2 Line' : `Edit · ${line!.id}`}</div>
            <h3>{isNew ? 'Add Non-PPMP Expenditure' : desc || 'Edit Line'}</h3>
            {acct && (
              <div className="chips" style={{ marginTop: 8 }}>
                <span className="role-tag reviewer"><i className="pi pi-tag" /> {acct.name}</span>
              </div>
            )}
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        {/* Body */}
        <div className="dw-body form" style={{ overflow: 'auto', flex: 1 }}>
          <div className="dw-section">
            <h4>Description</h4>
            <div className="field">
              <label>Description</label>
              <div className="input-wrap">
                <input
                  value={desc}
                  onChange={e => handleDescChange(e.target.value)}
                  placeholder="e.g. Online journal subscriptions — fiscal research"
                />
              </div>
              <div className="field-hint">
                Tip: type keywords like &ldquo;journal&rdquo;, &ldquo;foreign mission&rdquo;, &ldquo;conference&rdquo; to auto-suggest the account code.
              </div>
            </div>
          </div>

          <div className="dw-section">
            <h4>Justification</h4>
            <div className="field">
              <label>
                Why can&apos;t this be PPMP-planned?{' '}
                <span style={{ color: just.length < MIN_JUST ? 'rgb(var(--error-600))' : 'rgb(var(--success-700))', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  {just.length}/{MIN_JUST} min
                </span>
              </label>
              <textarea
                value={just}
                onChange={e => setJust(e.target.value)}
                placeholder="e.g. Recurring annual licences billed by vendor. Cannot be procurement-planned per item."
                style={{ minHeight: 96 }}
              />
              {!justOk && just.length > 0 && (
                <div style={{ fontSize: 11, color: 'rgb(var(--error-600))', marginTop: 4 }}>
                  Add {MIN_JUST - just.length} more character{MIN_JUST - just.length !== 1 ? 's' : ''}.
                </div>
              )}
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
                value={account || null}
                placeholder="Search accounts…"
                filterPlaceholder="Type code or name…"
                filter
                onChange={v => setAccount(v)}
              />
              {acct && (
                <div className="field-hint" style={{ marginTop: 6 }}>
                  {acct.type === 'CO' ? 'Capital Outlay' : `MOOE — ${acct.sub ?? ''}`}
                </div>
              )}
            </div>
          </div>

          <div className="dw-section">
            <h4>Amount</h4>
            <div className="field">
              <label>Amount (₱)</label>
              <div className="input-wrap">
                <span className="input-prefix">₱</span>
                <input
                  type="number"
                  min={0}
                  value={amount || ''}
                  onChange={e => setAmount(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="dw-section">
            <h4>Compliance</h4>
            <label className="check">
              <input type="checkbox" checked={certComplies} onChange={e => setCertComplies(e.target.checked)} />
              <span>This line item complies with NBM No. 156 and cannot be procurement-planned.</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={certAuth} onChange={e => setCertAuth(e.target.checked)} />
              <span>I am authorised to include this expenditure in the FY 2027 proposal.</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="dw-foot">
          {!isNew && onRemove && (
            <button className="btn danger-ghost" onClick={() => { onRemove(line!.id); onClose(); toast('Line removed.', 'pi-trash') }}>
              <i className="pi pi-trash" /> Remove
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave} disabled={!justOk && just.length > 0}>
            <i className="pi pi-check" /> {isNew ? 'Add Line' : 'Save'}
          </button>
        </div>
      </aside>
    </>
  )
}
