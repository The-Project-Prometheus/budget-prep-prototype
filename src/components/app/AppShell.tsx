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

export type AppPage =
  | 'dashboard' | 'documents' | 'legacy'
  | 'allotments' | 'obligations' | 'saro'
  | 'users' | 'offices' | 'settings'
  | 'sbps-dash' | 'sbps-ppmp' | 'sbps-sbpf1' | 'sbps-sbpf2' | 'sbps-proposal' | 'sbps-approvals'

const PAGE_TITLES: Record<AppPage, string> = {
  dashboard:       'Dashboard',
  documents:       'My Documents',
  legacy:          'Legacy Records',
  allotments:      'Allotments',
  obligations:     'Obligations',
  saro:            'SARO Routing',
  users:           'Users',
  offices:         'Offices',
  settings:        'Settings',
  'sbps-dash':     'FY 2027 Overview',
  'sbps-ppmp':     'PPMP — FY 2027',
  'sbps-sbpf1':    'SBPF1 — In PPMP',
  'sbps-sbpf2':    'SBPF2 — Non-PPMP',
  'sbps-proposal': 'Budget Proposal Summary',
  'sbps-approvals':'Approvals Inbox',
}

export default function AppShell() {
  const [page, setPage] = useState<AppPage>('sbps-dash')
  const router = useRouter()

  function navigate(p: string) { setPage(p as AppPage) }
  function signOut() { router.push('/auth') }

  return (
    <div className="app">
      <Sidebar currentPage={page} onNavigate={p => setPage(p as AppPage)} onSignOut={signOut} />
      <main className="main">
        <Topbar page={page} pageTitle={PAGE_TITLES[page]} />
        <section className="content">
          {page === 'users'           && <UsersPage />}
          {page === 'sbps-dash'       && <BudgetDashPage onNavigate={navigate} />}
          {page === 'sbps-ppmp'       && <PPMPPage />}
          {page === 'sbps-sbpf1'      && <SBPF1Page onNavigate={navigate} />}
          {page === 'sbps-sbpf2'      && <SBPF2Page />}
          {page === 'sbps-proposal'   && <ProposalPage onNavigate={navigate} />}
          {page === 'sbps-approvals'  && <ApprovalsPage />}
          {!['users','sbps-dash','sbps-ppmp','sbps-sbpf1','sbps-sbpf2','sbps-proposal','sbps-approvals'].includes(page) && (
            <ScaffoldPage title={PAGE_TITLES[page]} />
          )}
        </section>
      </main>
    </div>
  )
}

function ScaffoldPage({ title }: { title: string }) {
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">FY 2027</div>
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
