'use client'

import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/Toast'

interface Props {
  onVerify: () => void
  onBack: () => void
}

export default function OTPPane({ onVerify, onBack }: Props) {
  const [seconds, setSeconds] = useState(179)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const toast = useToast()

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s: number) => {
    if (s === 0) return 'expired'
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
  }

  function handleDigit(i: number, val: string) {
    const d = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = d
    setDigits(next)
    if (d && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div className="auth-pane">
      <div className="pane-eyebrow">BIS Access · Step 2 of 2</div>
      <h2>Enter your one-time passcode</h2>
      <p className="pane-lead">
        A 6-digit code was sent to your registered device ending in{' '}
        <b>•••• 2401</b>. It expires in{' '}
        <span className="otp-timer" style={{ fontFamily: 'var(--font-mono)', color: seconds < 30 ? 'rgb(var(--error-600))' : 'inherit' }}>
          {fmt(seconds)}
        </span>.
      </p>

      <div className="otp">
        {[0,1,2].map(i => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            className="otp-cell"
            maxLength={1}
            inputMode="numeric"
            value={digits[i]}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
          />
        ))}
        <span className="otp-sep">–</span>
        {[3,4,5].map(i => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            className="otp-cell"
            maxLength={1}
            inputMode="numeric"
            value={digits[i]}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
          />
        ))}
      </div>

      <div className="otp-meta">
        <span>Didn&apos;t receive it?</span>
        <button className="textlink" onClick={() => toast('New code sent.')}>Resend code</button>
        <span className="bull">•</span>
        <button className="textlink" onClick={() => toast('Switched to SMS fallback.')}>Use SMS instead</button>
      </div>

      <button className="btn primary block" onClick={onVerify}>
        <span>Verify &amp; Sign In</span> <i className="pi pi-check" />
      </button>
      <button className="btn ghost block" style={{ marginTop: 10 }} onClick={onBack}>
        <i className="pi pi-arrow-left" /> Back to sign in
      </button>
    </div>
  )
}
