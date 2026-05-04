'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import UsersPage from './UsersPage'
import BudgetDashPage from '@/components/budget/BudgetDashPage'
import PPMPPage from '@/components/budget/PPMPPage'
import SBPF1Page from '@/components/budget/SBPF1Page'
import SBPF2Page from '@/components/budget/SBPF2Page'
import ProposalPage from '@/components/budget/ProposalPage'
import ApprovalsPage from '@/components/budget/ApprovalsPage'
import { CYCLES, type Cycle } from '@/lib/nav-data'

export type AppPage =
  | 'dashboard' | 'documents' | 'inbox' | 'legacy'
  | 'allotments' | 'obligations' | 'saro'
  | 'utilization' | 'variance'
  | 'users' | 'offices' | 'roles' | 'audit' | 'settings'
  | 'sbps-dash' | 'sbps-ppmp' | 'sbps-sbpf1' | 'sbps-sbpf2' | 'sbps-proposal' | 'sbps-approvals'

const PAGE_TITLES: Record<AppPage, string> = {
  dashboard:        'Dashboard',
  documents:        'My Documents',
  inbox:            'Inbox',
  legacy:           'Legacy Records',
  allotments:       'Allotments',
  obligations:      'Obligations',
  saro:             'SARO Routing',
  utilization:      'Utilization',
  variance:         'Variance',
  users:            'Users',
  offices:          'Offices',
  roles:            'Roles & Permissions',
  audit:            'Audit Log',
  settings:         'System Settings',
  'sbps-dash':      'FY 2027 Overview',
  'sbps-ppmp':      'PPMP — FY 2027',
  'sbps-sbpf1':     'SBPF1 — In PPMP',
  'sbps-sbpf2':     'SBPF2 — Non-PPMP',
  'sbps-proposal':  'Budget Proposal Summary',
  'sbps-approvals': 'Approvals Inbox',
}

const BUDGET_PAGES = new Set<AppPage>(['sbps-dash','sbps-ppmp','sbps-sbpf1','sbps-sbpf2','sbps-proposal','sbps-approvals'])

export default function AppShell() {
  const [page, setPage] = useState<AppPage>('sbps-dash')
  const [cycle, setCycle] = useState<Cycle>(CYCLES[0])
  const router = useRouter()

  function navigate(p: string) { setPage(p as AppPage) }

  return (
    <div className="app">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        onSignOut={() => router.push('/auth')}
        cycle={cycle}
        onCycleChange={setCycle}
      />
      <main className="main">
        <Topbar page={page} pageTitle={PAGE_TITLES[page]} cycle={cycle} />
        <section className="content">
          {page === 'users'           && <UsersPage />}
          {page === 'sbps-dash'       && <BudgetDashPage onNavigate={navigate} />}
          {page === 'sbps-ppmp'       && <PPMPPage />}
          {page === 'sbps-sbpf1'      && <SBPF1Page onNavigate={navigate} />}
          {page === 'sbps-sbpf2'      && <SBPF2Page />}
          {page === 'sbps-proposal'   && <ProposalPage onNavigate={navigate} />}
          {page === 'sbps-approvals'  && <ApprovalsPage />}
          {!BUDGET_PAGES.has(page) && page !== 'users' && (
            <ScaffoldPage title={PAGE_TITLES[page]} cycle={cycle} />
          )}
        </section>
      </main>
    </div>
  )
}

function ScaffoldPage({ title, cycle }: { title: string; cycle: Cycle }) {
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">{cycle.fy} · {cycle.phase}</div>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <img src="/assets/images/search_engine.svg" style={{ width: 140, opacity: 0.9 }} alt="" />
        <h4 style={{ margin: '14px 0 4px', fontSize: 16, fontWeight: 700 }}>{title}</h4>
        <p style={{ margin: 0, color: 'var(--fg-3)', fontSize: 13 }}>
          This scaffolded view is not covered by this prototype.
        </p>
      </div>
    </>
  )
}
