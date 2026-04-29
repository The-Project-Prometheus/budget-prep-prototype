export default function AuthHero() {
  return (
    <aside className="auth-hero">
      <div className="hero-top">
        <img src="/assets/senate_logo.png" alt="Senate of the Philippines" />
        <div>
          <div className="hero-republic">Republic of the Philippines</div>
          <div className="hero-name">Senate of the Philippines</div>
        </div>
      </div>

      <div className="hero-middle">
        <div className="hero-display">Budget<br />Information<br />System</div>
        <div className="hero-suite">
          <span className="suite-pill on"><i className="pi pi-pencil" /> Preparation</span>
          <span className="suite-pill"><i className="pi pi-bars-progress" /> Execution</span>
          <span className="suite-pill"><i className="pi pi-chart-bar" /> Reporting</span>
        </div>
        <div className="hero-caption">
          A unified platform for the legislative budget cycle. <b>Preparation</b> is the FY 2027
          budget proposal workspace — PPMP, SBPF, market scoping, and routing — used by office
          preparers, directors, LBS evaluators, and PPS reviewers.
        </div>
      </div>

      <div className="hero-foot">
        <div className="hero-meta">
          <div className="hero-meta-k">Module</div>
          <div className="hero-meta-v">BIS · Budget Preparation v1.2</div>
        </div>
        <div className="hero-meta">
          <div className="hero-meta-k">Cycle</div>
          <div className="hero-meta-v">FY 2027 · DBM cut-off 28 Apr 2026</div>
        </div>
        <div className="hero-meta">
          <div className="hero-meta-k">Support</div>
          <div className="hero-meta-v">helpdesk@senate.gov.ph · local 5500</div>
        </div>
        <div className="hero-legal">
          Authorised users only. Activity on this system is logged and monitored
          in accordance with the Data Privacy Act of 2012 (R.A. 10173).
        </div>
      </div>
    </aside>
  )
}
