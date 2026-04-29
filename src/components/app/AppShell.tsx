'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import UsersPage from './UsersPage'

export type AppPage = 'dashboard' | 'documents' | 'legacy' | 'allotments' | 'obligations' | 'saro' | 'users' | 'offices' | 'settings'

const PAGE_TITLES: Record<AppPage, string> = {
  dashboard: 'Dashboard',
  documents: 'My Documents',
  legacy: 'Legacy Records',
  allotments: 'Allotments',
  obligations: 'Obligations',
  saro: 'SARO Routing',
  users: 'Users',
  offices: 'Offices',
  settings: 'Settings',
}

export default function AppShell() {
  const [page, setPage] = useState<AppPage>('users')
  const router = useRouter()

  function signOut() {
    router.push('/auth')
  }

  return (
    <div className="app">
      <Sidebar currentPage={page} onNavigate={setPage} onSignOut={signOut} />
      <main className="main">
        <Topbar page={page} />
        <section className="content">
          {page === 'users' ? (
            <UsersPage />
          ) : (
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
