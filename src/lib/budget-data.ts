export interface Account {
  code: string; name: string; type: 'MOOE' | 'CO' | 'PS'; sub?: string
}

export interface PPMPItem {
  id: string; cat: 'CUS' | 'SUPP' | 'PROJ'
  desc: string; qty: number; unit: string; unit_cost: number
  account: string; proc: string; src: string; sched: string
  scoping: boolean; flag: string | null
}

export interface SBPF2Line {
  id: string; desc: string; just: string; account: string; amount: number
}

export interface ProposalLine {
  type: 'MOOE' | 'CO' | 'PS'
  acct: string; y25: number; y26: number; y27: number
  remarks: string; priority?: number; just?: string
}

export interface CalendarItem {
  d: string; t: string; owner: string; done: boolean; current: boolean
}

export interface ApprovalPackage {
  id: string; office: string; preparer: string; total: number
  status: 'in-review' | 'pending' | 'returned' | 'approved'
  stage: string; submitted: string; hue: number
}

export const SBPS_ACCOUNTS: Account[] = [
  { code:'5-02-03-010', name:'Office Supplies Expenses',        type:'MOOE', sub:'Supplies' },
  { code:'5-02-03-050', name:'Drugs & Medicines Expenses',       type:'MOOE', sub:'Supplies' },
  { code:'5-02-03-070', name:'Food Supplies Expenses',           type:'MOOE', sub:'Supplies' },
  { code:'5-02-03-210', name:'Other Supplies — Semi-Expendable', type:'MOOE', sub:'Supplies' },
  { code:'5-02-12-010', name:'Janitorial Services',              type:'MOOE', sub:'Centralized · Admin' },
  { code:'5-02-12-020', name:'Security Services',                type:'MOOE', sub:'Centralized · Admin' },
  { code:'5-02-02-010', name:'Training Expenses',                type:'MOOE', sub:'Centralized · HRMS' },
  { code:'5-02-99-010', name:'Subscriptions & Periodicals',      type:'MOOE', sub:'General' },
  { code:'5-02-99-040', name:"Membership Dues — Org'l",          type:'MOOE', sub:'General' },
  { code:'5-02-04-010', name:'Travelling Expenses — Local',      type:'MOOE', sub:'Travel' },
  { code:'5-02-04-020', name:'Travelling Expenses — Foreign',    type:'MOOE', sub:'Travel' },
  { code:'1-07-05-020', name:'Office Equipment',                 type:'CO' },
  { code:'1-07-05-030', name:'IT Equipment & Software',          type:'CO' },
  { code:'1-07-07-010', name:'Furniture & Fixtures',             type:'CO' },
]

export function accountByCode(code: string): Account {
  return SBPS_ACCOUNTS.find(a => a.code === code) ?? { code, name:'(unknown)', type:'MOOE' }
}

export const SBPS_PPMP_ITEMS: PPMPItem[] = [
  { id:'PI-001', cat:'CUS',  desc:'Bond paper, A4, 70 gsm, 500 sheets/ream',       qty:240, unit:'ream',  unit_cost:240,    account:'5-02-03-010', proc:'Shopping',            src:'GoP', sched:'Q1–Q4',  scoping:true,  flag:null },
  { id:'PI-002', cat:'CUS',  desc:'Toner cartridge, HP 26A black',                  qty:36,  unit:'pc',    unit_cost:5800,   account:'5-02-03-010', proc:'Small Value',         src:'GoP', sched:'Q1, Q3', scoping:true,  flag:null },
  { id:'PI-003', cat:'CUS',  desc:'Ballpoint pens, blue, 0.7mm, 12s/box',           qty:80,  unit:'box',   unit_cost:180,    account:'5-02-03-010', proc:'Shopping',            src:'GoP', sched:'Q1–Q4',  scoping:true,  flag:null },
  { id:'PI-004', cat:'CUS',  desc:'Manila folder, long, 100s/pack',                 qty:24,  unit:'pack',  unit_cost:520,    account:'5-02-03-010', proc:'Shopping',            src:'GoP', sched:'Q2',     scoping:true,  flag:null },
  { id:'PI-005', cat:'CUS',  desc:'First-aid medicine kit refill, standard',        qty:14,  unit:'kit',   unit_cost:1850,   account:'5-02-03-050', proc:'Shopping',            src:'GoP', sched:'Q2',     scoping:true,  flag:null },
  { id:'PI-006', cat:'SUPP', desc:'Desk fan, 16-inch, oscillating',                 qty:12,  unit:'pc',    unit_cost:2400,   account:'5-02-03-210', proc:'Small Value',         src:'GoP', sched:'Q2',     scoping:true,  flag:null },
  { id:'PI-007', cat:'SUPP', desc:'Office chair, mid-back ergonomic',               qty:18,  unit:'pc',    unit_cost:8500,   account:'5-02-03-210', proc:'Small Value',         src:'GoP', sched:'Q3',     scoping:true,  flag:null },
  { id:'PI-008', cat:'SUPP', desc:'Laptop, business class, 16GB / 512GB SSD',       qty:6,   unit:'pc',    unit_cost:75000,  account:'1-07-05-030', proc:'Competitive Bidding', src:'GoP', sched:'Q1',     scoping:true,  flag:'PPS / EDP-MIS' },
  { id:'PI-009', cat:'PROJ', desc:'Multi-function copier, A3, network',             qty:2,   unit:'unit',  unit_cost:185000, account:'1-07-05-020', proc:'Competitive Bidding', src:'GoP', sched:'Q2',     scoping:true,  flag:null },
  { id:'PI-010', cat:'PROJ', desc:'4-drawer steel filing cabinet, lockable',        qty:8,   unit:'unit',  unit_cost:14500,  account:'1-07-07-010', proc:'Small Value',         src:'GoP', sched:'Q3',     scoping:true,  flag:null },
]

export const SBPS_SBPF2_LINES: SBPF2Line[] = [
  { id:'L2-001', desc:'Online journal subscriptions — fiscal & legislative research', just:'Recurring annual licences (LexisNexis, IMF eLibrary). Cannot be procurement-planned per item.', account:'5-02-99-010', amount:285000 },
  { id:'L2-002', desc:'Foreign mission travel — IPU Assembly, Geneva',                just:'Two-delegate participation, dates locked by IPU Secretariat. Not biddable in advance.',           account:'5-02-04-020', amount:720000 },
  { id:'L2-003', desc:'Conference fees — APPF, ASEAN Inter-Parliamentary Assembly',  just:'Mandatory dues for Senate participation. Billed on attendance.',                                  account:'5-02-99-040', amount:145000 },
]

export const SBPS_PROPOSAL_LINES: ProposalLine[] = [
  { type:'MOOE', acct:'Office Supplies (5-02-03-010)',            y25:142800,  y26:156400,  y27:173400,  remarks:'Volume +9% vs FY26 to cover hearing-week peaks.' },
  { type:'MOOE', acct:'Drugs & Medicines (5-02-03-050)',           y25:22300,   y26:24800,   y27:25900,   remarks:'In line with HQ headcount.' },
  { type:'MOOE', acct:'Other Supplies — Semi-Exp. (5-02-03-210)', y25:96400,   y26:108200,  y27:181800,  remarks:'New ergonomic chairs, fans (PPMP-driven).' },
  { type:'MOOE', acct:'Janitorial / Security (centralized)',       y25:0,       y26:0,       y27:0,       remarks:'Centralized to Admin Services per NBM 156.' },
  { type:'MOOE', acct:'Training Expenses (centralized)',           y25:0,       y26:0,       y27:0,       remarks:'Centralized to HRMS per FY27 directive.' },
  { type:'MOOE', acct:'Subscriptions & Periodicals',               y25:246000,  y26:268000,  y27:285000,  remarks:'SBPF2 — research databases.' },
  { type:'MOOE', acct:'Membership Dues',                           y25:132000,  y26:138000,  y27:145000,  remarks:'SBPF2 — APPF, AIPA dues.' },
  { type:'MOOE', acct:'Local Travel',                              y25:188000,  y26:196000,  y27:210000,  remarks:'Committee field hearings; +7%.' },
  { type:'MOOE', acct:'Foreign Travel',                            y25:612000,  y26:680000,  y27:720000,  remarks:'IPU Geneva mission (SBPF2).' },
  { type:'CO',   acct:'IT Equipment — Laptops (PI-008)',           y25:0,       y26:0,       y27:450000,  remarks:'PPS-flagged for technical eval.', priority:1, just:'Replacement for end-of-life FY22 units; needed for FY27 hearings.' },
  { type:'CO',   acct:'Office Equipment — Copier (PI-009)',        y25:0,       y26:0,       y27:370000,  remarks:'Replaces 2018 unit, 2nd priority.', priority:2 },
  { type:'CO',   acct:'Furniture — Filing Cabinets (PI-010)',      y25:0,       y26:0,       y27:116000,  remarks:'For new committee secretariat space.', priority:3 },
]

export const SBPS_CALENDAR: CalendarItem[] = [
  { d:'15 Mar 2026', t:'PPMP draft kickoff — DBM circular released',      owner:'Bureau Director',           done:true,  current:false },
  { d:'05 Apr 2026', t:'Indicative FY 2027 budget ceilings issued',       owner:'Legislative Budget Service', done:true,  current:false },
  { d:'15 Apr 2026', t:'PPMP submission to PPMS',                          owner:'All Bureaus',               done:true,  current:false },
  { d:'25 Apr 2026', t:'Market Scoping checklist due',                     owner:'Procurement Service',        done:false, current:true  },
  { d:'05 May 2026', t:'SBPF1 / SBPF2 finalised in BIS',                  owner:'Preparer · Director',        done:false, current:false },
  { d:'15 May 2026', t:'Budget Proposal package routed to Deputy Sec.',   owner:'Bureau Director',           done:false, current:false },
  { d:'30 May 2026', t:'LBS evaluation — first round',                    owner:'LBS Evaluators',             done:false, current:false },
  { d:'15 Jun 2026', t:'Senate Budget consolidated · sent to DBM',        owner:'Senate Secretary',           done:false, current:false },
]

export const SBPS_APPROVALS: ApprovalPackage[] = [
  { id:'PKG-2027-014', office:'Committee on Finance',           preparer:'Juan Dela Cruz',    total:2010800, status:'in-review', stage:'LBS Evaluation', submitted:'05 May 2026', hue:215 },
  { id:'PKG-2027-008', office:'Committee on Ways & Means',      preparer:'Rafael Ignacio',    total:1845200, status:'in-review', stage:'Deputy Sec.',     submitted:'04 May 2026', hue:275 },
  { id:'PKG-2027-021', office:'Office of the Senate President', preparer:'Benjamin Tan',      total:4280500, status:'pending',   stage:'Director',        submitted:'06 May 2026', hue:10  },
  { id:'PKG-2027-005', office:'Senate Electoral Tribunal',      preparer:'Kristine Valdez',   total:928400,  status:'returned',  stage:'Returned',        submitted:'02 May 2026', hue:195 },
  { id:'PKG-2027-018', office:'Senate Secretariat',             preparer:'Patricia Bautista', total:3410200, status:'pending',   stage:'Director',        submitted:'06 May 2026', hue:35  },
  { id:'PKG-2027-002', office:'Office of Sen. Hontiveros',      preparer:'Marianne Aquino',   total:742600,  status:'approved',  stage:'LBS Approved',    submitted:'28 Apr 2026', hue:250 },
]

export const PPMP_BUFFER = 0.10
export const PPMP_CAT_LABELS: Record<string, string> = {
  CUS:  'Common-Use Supplies',
  SUPP: 'Supplementary Items (Semi-Expendable)',
  PROJ: 'Projects (Capital Outlay)',
}

export function ppmpSubtotal() {
  return SBPS_PPMP_ITEMS.reduce((s, i) => s + i.qty * i.unit_cost, 0)
}
export function ppmpBuffered() {
  return Math.round(ppmpSubtotal() * (1 + PPMP_BUFFER))
}
export function sbpf1Total() { return ppmpSubtotal() }
export function sbpf2Total() { return SBPS_SBPF2_LINES.reduce((s, l) => s + l.amount, 0) }
export function proposalTotal() { return sbpf1Total() + sbpf2Total() }

export const SBPS_DASHBOARD_DERIVED = {
  get fy25() { return SBPS_PROPOSAL_LINES.reduce((s, l) => s + l.y25, 0) },
  get fy26() { return SBPS_PROPOSAL_LINES.reduce((s, l) => s + l.y26, 0) },
}

export function peso(n: number) {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
export function pesoSm(n: number) {
  return n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
export function avatarInitials(name: string) {
  return name.split(' ').map(s => s[0]).join('').slice(0, 2)
}
