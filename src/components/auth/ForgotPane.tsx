'use client'

interface Props {
  onSent: () => void
  onBack: () => void
}

export default function ForgotPane({ onSent, onBack }: Props) {
  return (
    <div className="auth-pane">
      <div className="pane-eyebrow">Password Recovery</div>
      <h2>Reset your password</h2>
      <p className="pane-lead">
        Enter your Senate email. If an account exists, we&apos;ll send a reset link that expires
        in 30 minutes.
      </p>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSent() }}>
        <div className="field">
          <label>Email</label>
          <div className="input-wrap">
            <i className="pi pi-envelope" />
            <input type="email" defaultValue="j.delacruz@senate.gov.ph" />
          </div>
        </div>
        <button className="btn primary block" type="submit">Send Reset Link</button>
      </form>
      <div className="pane-foot">
        <button className="textlink" onClick={onBack}>
          <i className="pi pi-arrow-left" /> Back to sign in
        </button>
      </div>
    </div>
  )
}
