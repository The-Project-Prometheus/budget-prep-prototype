'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

interface Props {
  onOtp: () => void
  onForgot: () => void
  onRegister: () => void
}

export default function LoginPane({ onOtp, onForgot, onRegister }: Props) {
  const [showPw, setShowPw] = useState(false)
  const toast = useToast()

  return (
    <div className="auth-pane">
      <div className="pane-eyebrow">BIS Access · Step 1 of 2</div>
      <h2>Sign in to BIS</h2>
      <p className="pane-lead">
        Use your <code>@senate.gov.ph</code> credentials. You will be asked for a
        one-time passcode from your registered device.
      </p>

      <form
        className="form"
        onSubmit={(e) => { e.preventDefault(); onOtp() }}
      >
        <div className="field">
          <label>Email</label>
          <div className="input-wrap">
            <i className="pi pi-envelope" />
            <input type="email" defaultValue="j.delacruz@senate.gov.ph" autoComplete="username" />
          </div>
        </div>
        <div className="field">
          <div className="field-row">
            <label>Password</label>
            <button type="button" className="textlink" onClick={onForgot}>Forgot password?</button>
          </div>
          <div className="input-wrap">
            <i className="pi pi-lock" />
            <input
              type={showPw ? 'text' : 'password'}
              defaultValue="correcthorse"
              autoComplete="current-password"
            />
            <button type="button" className="icon-btn" onClick={() => setShowPw(v => !v)}>
              <i className={`pi ${showPw ? 'pi-eye-slash' : 'pi-eye'}`} />
            </button>
          </div>
        </div>
        <label className="check">
          <input type="checkbox" defaultChecked />
          <span>Remember this device for 14 days</span>
        </label>
        <button className="btn primary block" type="submit">
          <span>Sign In</span> <i className="pi pi-arrow-right" />
        </button>
      </form>

      <div className="divider"><span>or</span></div>
      <button className="btn secondary block" onClick={() => toast('Redirecting to Senate SSO…')}>
        <i className="pi pi-id-card" /> Continue with Senate SSO
      </button>
      <div className="pane-foot">
        New to BIS?{' '}
        <button className="textlink" onClick={onRegister}>Request an account</button>
      </div>
    </div>
  )
}
