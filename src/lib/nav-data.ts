export interface NavItem {
  kind: 'item'
  id: string; label: string; icon: string; section: string
  badge?: string; badgeAlert?: boolean
}

export interface NavGroup {
  kind: 'group'
  id: string; label: string; icon: string; section: string
  defaultOpen?: boolean
  children: { id: string; label: string; crumb: string[] }[]
}

export type NavNode = NavItem | NavGroup

export const NAV_TREE: NavNode[] = [
  { kind:'item', id:'dashboard', label:'Dashboard',    icon:'pi pi-th-large', section:'Workspace' },
  { kind:'item', id:'documents', label:'My Documents', icon:'pi pi-folder',   section:'Workspace', badge:'12' },
  { kind:'item', id:'inbox',     label:'Inbox',        icon:'pi pi-inbox',    section:'Workspace', badge:'3', badgeAlert:true },

  { kind:'group', id:'preparation', label:'Preparation', icon:'pi pi-pencil', section:'Budget Cycle', defaultOpen:true,
    children: [
      { id:'sbps-dash',      label:'Overview',            crumb:['Preparation','Overview'] },
      { id:'sbps-ppmp',      label:'PPMP',                crumb:['Preparation','PPMP'] },
      { id:'sbps-sbpf1',     label:'SBPF1 — In PPMP',    crumb:['Preparation','SBPF1'] },
      { id:'sbps-sbpf2',     label:'SBPF2 — Non-PPMP',   crumb:['Preparation','SBPF2'] },
      { id:'sbps-proposal',  label:'Proposal Summary',    crumb:['Preparation','Proposal Summary'] },
      { id:'sbps-approvals', label:'Approvals Inbox',     crumb:['Preparation','Approvals Inbox'] },
    ]
  },
  { kind:'group', id:'execution', label:'Execution', icon:'pi pi-bars-progress', section:'Budget Cycle',
    children: [
      { id:'allotments',  label:'Allotments',   crumb:['Execution','Allotments'] },
      { id:'obligations', label:'Obligations',  crumb:['Execution','Obligations'] },
      { id:'saro',        label:'SARO Routing', crumb:['Execution','SARO Routing'] },
    ]
  },
  { kind:'group', id:'reporting', label:'Reporting', icon:'pi pi-chart-bar', section:'Budget Cycle',
    children: [
      { id:'utilization', label:'Utilization',    crumb:['Reporting','Utilization'] },
      { id:'variance',    label:'Variance',       crumb:['Reporting','Variance'] },
      { id:'legacy',      label:'Legacy Records', crumb:['Reporting','Legacy Records'] },
    ]
  },

  { kind:'group', id:'admin', label:'Administration', icon:'pi pi-shield', section:'System', defaultOpen:true,
    children: [
      { id:'users',    label:'Users',               crumb:['Administration','Users'] },
      { id:'offices',  label:'Offices',             crumb:['Administration','Offices'] },
      { id:'roles',    label:'Roles & Permissions', crumb:['Administration','Roles & Permissions'] },
      { id:'audit',    label:'Audit Log',           crumb:['Administration','Audit Log'] },
      { id:'settings', label:'System Settings',     crumb:['Administration','Settings'] },
    ]
  },
]

export interface Cycle {
  id: string; fy: string; phase: string; status: string; note: string
}

export const CYCLES: Cycle[] = [
  { id:'fy2027', fy:'FY 2027', phase:'Preparation', status:'Active',   note:'DBM cut-off · 28 Apr 2026' },
  { id:'fy2026', fy:'FY 2026', phase:'Execution',   status:'Live',     note:'Q2 obligations open' },
  { id:'fy2025', fy:'FY 2025', phase:'Reporting',   status:'Closing',  note:'Year-end reports' },
  { id:'fy2024', fy:'FY 2024', phase:'Closed',      status:'Archived', note:'Read-only archive' },
]

export function getCrumbForPage(pageId: string): string[] {
  for (const node of NAV_TREE) {
    if (node.kind === 'item' && node.id === pageId) return [node.label]
    if (node.kind === 'group') {
      const child = node.children.find(c => c.id === pageId)
      if (child) return child.crumb
    }
  }
  return [pageId]
}

export function getParentGroup(pageId: string): string | null {
  for (const node of NAV_TREE) {
    if (node.kind === 'group' && node.children.some(c => c.id === pageId)) return node.id
  }
  return null
}
