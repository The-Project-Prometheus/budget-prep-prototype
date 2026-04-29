'use client'

import { useState } from 'react'

interface Props {
  onSubmitted: () => void
  onLogin: () => void
}

const OFFICES = [
  'Committee on Finance',
  'Office of the Senate President',
  'Senate Secretariat',
  'Property & Procurement Service (PPS)',
  'Legislative Budget Service (LBS)',
  'Human Resource Management Service (HRMS)',
  'Management & Physical Facilities Service (MPFS)',
]

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw) && /[0-9]/.test(pw)) score++
  const labels = ['Too short','Weak','Fair','Good','Strong']
  const colors = ['#b91c1c','#b91c1c','#c2410c','#15803d','#15803d']
  return { score, label: labels[score] ?? 'Too short', color: colors[score] ?? colors[0] }
}

export default function RegisterPane({ onSubmitted, onLogin }: Props) {
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('MyStrong!Pass2026')
  const strength = getStrength(pw)

  return (
    <div className="auth-pane">
      <div className="pane-eyebrow">Request Access</div>
      <h2>Create a BIS account</h2>
      <p className="pane-lead">
        Access is granted only to staff with an active Senate email. Your request is reviewed
        by the BIS Administrator within one working day.
      </p>

      <div className="reg-steps">
        <div className="rstep on"><span className="rstep-n">1</span> Identity</div>
        <div className="rstep-line" />
        <div className="rstep"><span className="rstep-n">2</span> Role</div>
        <div className="rstep-line" />
        <div className="rstep"><span className="rstep-n">3</span> Review</div>
      </div>

      <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmitted() }}>
        <div className="grid-2">
          <div className="field">
            <label>First Name</label>
            <div className="input-wrap"><input defaultValue="Juan" /></div>
          </div>
          <div className="field">
            <label>Last Name</label>
            <div className="input-wrap"><input defaultValue="Dela Cruz" /></div>
          </div>
        </div>

        <div className="field">
          <label>Senate Email</label>
          <div className="input-wrap">
            <i className="pi pi-envelope" />
            <input type="email" defaultValue="j.delacruz@senate.gov.ph" />
            <span className="input-suffix ok"><i className="pi pi-check-circle" /> verified</span>
          </div>
          <div className="field-hint">Must end in <code>@senate.gov.ph</code>.</div>
        </div>

        <div className="field">
          <label>Office</label>
          <div className="input-wrap">
            <i className="pi pi-building" />
            <select>
              {OFFICES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Mobile Number</label>
          <div className="input-wrap">
            <span className="input-prefix">+63</span>
            <input defaultValue="917 123 4567" />
          </div>
          <div className="field-hint">Used only for OTP delivery.</div>
        </div>

        <div className="field">
          <label>Password</label>
          <div className="input-wrap">
            <i className="pi pi-lock" />
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={e => setPw(e.target.value)}
            />
            <button type="button" className="icon-btn" onClick={() => setShowPw(v => !v)}>
              <i className={`pi ${showPw ? 'pi-eye-slash' : 'pi-eye'}`} />
            </button>
          </div>
          <div className="strength">
            <div className="strength-bars">
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className="bar"
                  style={{ background: i < strength.score ? strength.color : undefined }}
                />
              ))}
            </div>
            <div className="strength-label">
              <span style={{ fontFamily: 'var(--font-menu)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: strength.color }}>
                {strength.label}
              </span>
              {' · 12+ chars, symbol, digits'}
            </div>
          </div>
        </div>

        <label className="check">
          <input type="checkbox" required />
          <span>
            I have read and accept the{' '}
            <a className="textlink" href="#">Acceptable Use Policy</a> and the{' '}
            <a className="textlink" href="#">Data Privacy Notice</a>.
          </span>
        </label>

        <button className="btn primary block" type="submit">
          <span>Submit Request</span> <i className="pi pi-arrow-right" />
        </button>
      </form>

      <div className="pane-foot">
        Already have an account?{' '}
        <button className="textlink" onClick={onLogin}>Sign in</button>
      </div>
    </div>
  )
}
