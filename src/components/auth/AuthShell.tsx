'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthHero from './AuthHero'
import LoginPane from './LoginPane'
import OTPPane from './OTPPane'
import RegisterPane from './RegisterPane'
import ForgotPane from './ForgotPane'

export type AuthView = 'login' | 'otp' | 'register' | 'submitted' | 'forgot' | 'forgot-sent'

export default function AuthShell() {
  const [view, setView] = useState<AuthView>('login')
  const router = useRouter()

  const inLoginFlow = ['login', 'otp', 'forgot', 'forgot-sent'].includes(view)

  function goApp() {
    router.push('/dashboard')
  }

  return (
    <div className="auth-shell">
      <AuthHero />

      <section className="auth-form">
        <div className="auth-switcher">
          <button
            className={`auth-tab${inLoginFlow ? ' on' : ''}`}
            onClick={() => setView('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${!inLoginFlow ? ' on' : ''}`}
            onClick={() => setView('register')}
          >
            Request Access
          </button>
        </div>

        {view === 'login' && <LoginPane onOtp={() => setView('otp')} onForgot={() => setView('forgot')} onRegister={() => setView('register')} />}
        {view === 'otp'  && <OTPPane onVerify={goApp} onBack={() => setView('login')} />}
        {view === 'register'  && <RegisterPane onSubmitted={() => setView('submitted')} onLogin={() => setView('login')} />}
        {view === 'submitted' && <SubmittedPane onBack={() => setView('login')} />}
        {view === 'forgot'    && <ForgotPane onSent={() => setView('forgot-sent')} onBack={() => setView('login')} />}
        {view === 'forgot-sent' && <ForgotSentPane onBack={() => setView('login')} />}
      </section>
    </div>
  )
}

function SubmittedPane({ onBack }: { onBack: () => void }) {
  return (
    <div className="auth-pane">
      <div className="pane-eyebrow">Request Received</div>
      <div className="success-ring"><i className="pi pi-send" /></div>
      <h2>Your request was submitted</h2>
      <p className="pane-lead">
        Reference <code className="ref-mono">BIS-REQ-2026-00412</code>. The BIS Administrator
        typically reviews requests within one working day. You&apos;ll receive approval at{' '}
        <b>j.delacruz@senate.gov.ph</b>.
      </p>
      <div className="notice">
        <i className="pi pi-info-circle" />
        <div>
          <b>What happens next</b>
          <div>
            Your office head will be notified to co-sign. Once approved, you&apos;ll receive
            credentials and be prompted to enroll an OTP device.
          </div>
        </div>
      </div>
      <button className="btn primary block" onClick={onBack}>Return to Sign In</button>
    </div>
  )
}

function ForgotSentPane({ onBack }: { onBack: () => void }) {
  return (
    <div className="auth-pane">
      <div className="success-ring"><i className="pi pi-envelope" /></div>
      <h2>Check your inbox</h2>
      <p className="pane-lead">
        If an account exists for <b>j.delacruz@senate.gov.ph</b>, a reset link is on its way.
      </p>
      <button className="btn primary block" onClick={onBack}>Return to Sign In</button>
    </div>
  )
}
