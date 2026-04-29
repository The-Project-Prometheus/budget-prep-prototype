export type UserStatus = 'active' | 'pending' | 'invited' | 'suspended' | 'disabled'
export type UserRole = 'admin' | 'approver' | 'reviewer' | 'clerk' | 'viewer'

export interface BISUser {
  id: string
  first: string
  last: string
  initials: string
  email: string
  office: string
  role: UserRole
  status: UserStatus
  lastActive: string
  created: string
  mfa: boolean
  hue: number
}

export interface RoleDef {
  name: string
  desc: string
  icon: string
}

export interface PermDef {
  id: string
  name: string
  desc: string
}

export interface ActivityItem {
  kind: '' | 'ok' | 'warn' | 'err'
  text: string
  when: string
  ip: string
}

export const BIS_USERS: BISUser[] = [
  { id:'u-001', first:'Juan',     last:'Dela Cruz',   initials:'JD', email:'j.delacruz@senate.gov.ph', office:'Committee on Finance',              role:'admin',    status:'active',    lastActive:'Today, 9:42',       created:'12 Jan 2024', mfa:true,  hue:215 },
  { id:'u-002', first:'Elena',    last:'Reyes',       initials:'ER', email:'e.reyes@senate.gov.ph',    office:'Committee on Finance',              role:'approver', status:'active',    lastActive:'Today, 8:05',       created:'04 Mar 2024', mfa:true,  hue:340 },
  { id:'u-003', first:'Miguel',   last:'Santos',      initials:'MS', email:'m.santos@senate.gov.ph',   office:'Office of Sen. Angara',             role:'reviewer', status:'active',    lastActive:'Yesterday, 17:21',  created:'18 Aug 2024', mfa:true,  hue:160 },
  { id:'u-004', first:'Patricia', last:'Bautista',    initials:'PB', email:'p.bautista@senate.gov.ph', office:'Senate Secretariat',               role:'clerk',    status:'pending',   lastActive:'—',                 created:'22 Apr 2026', mfa:false, hue:35  },
  { id:'u-005', first:'Rafael',   last:'Ignacio',     initials:'RI', email:'r.ignacio@senate.gov.ph',  office:'Committee on Ways & Means',         role:'reviewer', status:'active',    lastActive:'2 days ago',        created:'09 Feb 2025', mfa:true,  hue:275 },
  { id:'u-006', first:'Kristine', last:'Valdez',      initials:'KV', email:'k.valdez@senate.gov.ph',   office:'Senate Electoral Tribunal',         role:'viewer',   status:'active',    lastActive:'Today, 10:15',      created:'30 Oct 2024', mfa:false, hue:195 },
  { id:'u-007', first:'Benjamin', last:'Tan',         initials:'BT', email:'b.tan@senate.gov.ph',      office:'Office of the Senate President',    role:'approver', status:'suspended', lastActive:'14 Mar 2026',       created:'12 Jul 2023', mfa:true,  hue:10  },
  { id:'u-008', first:'Liza',     last:'Mendoza',     initials:'LM', email:'l.mendoza@senate.gov.ph',  office:'Committee on Finance',              role:'clerk',    status:'active',    lastActive:'Today, 11:38',      created:'01 Sep 2024', mfa:true,  hue:130 },
  { id:'u-009', first:'Andres',   last:'Villanueva',  initials:'AV', email:'a.villanueva@senate.gov.ph',office:'Commission on Appointments',       role:'clerk',    status:'invited',   lastActive:'—',                 created:'21 Apr 2026', mfa:false, hue:50  },
  { id:'u-010', first:'Sofia',    last:'Lim',         initials:'SL', email:'s.lim@senate.gov.ph',      office:'Office of Sen. Legarda',            role:'reviewer', status:'active',    lastActive:'Today, 7:02',       created:'16 May 2025', mfa:true,  hue:300 },
  { id:'u-011', first:'Dennis',   last:'Ocampo',      initials:'DO', email:'d.ocampo@senate.gov.ph',   office:'Committee Secretariat',            role:'viewer',   status:'disabled',  lastActive:'02 Feb 2026',       created:'11 Nov 2023', mfa:false, hue:90  },
  { id:'u-012', first:'Marianne', last:'Aquino',      initials:'MA', email:'m.aquino@senate.gov.ph',   office:'Office of Sen. Hontiveros',         role:'approver', status:'active',    lastActive:'Today, 6:48',       created:'08 Jan 2025', mfa:true,  hue:250 },
]

export const BIS_ROLES: Record<UserRole, RoleDef> = {
  admin:    { name:'Administrator', desc:'Full system control, user & role management, audit log access.',              icon:'pi-shield'    },
  approver: { name:'Approver',      desc:'Sign, route, and certify documents on behalf of their office.',              icon:'pi-verified'  },
  reviewer: { name:'Reviewer',      desc:'Annotate, comment, and recommend. Cannot sign or route externally.',         icon:'pi-eye'       },
  clerk:    { name:'Clerk',         desc:'File new documents, attach annexes, manage routing within office.',          icon:'pi-file-edit' },
  viewer:   { name:'Viewer',        desc:'Read-only access to documents shared with their office.',                    icon:'pi-book'      },
}

export const BIS_PERMS: Record<UserRole, string[]> = {
  admin:    ['users.manage','roles.assign','docs.read','docs.write','docs.route','docs.sign','saro.release','audit.view','settings.edit'],
  approver: ['docs.read','docs.write','docs.route','docs.sign','saro.release'],
  reviewer: ['docs.read','docs.write','docs.route'],
  clerk:    ['docs.read','docs.write'],
  viewer:   ['docs.read'],
}

export const BIS_PERM_CATALOG: PermDef[] = [
  { id:'users.manage',  name:'Manage users',    desc:'Invite, suspend, and delete user accounts.'           },
  { id:'roles.assign',  name:'Assign roles',    desc:'Change role assignments for any user.'                },
  { id:'docs.read',     name:'Read documents',  desc:'View documents routed to their office.'               },
  { id:'docs.write',    name:'File documents',  desc:'Create new documents and attach annexes.'             },
  { id:'docs.route',    name:'Route documents', desc:'Forward documents to other offices.'                  },
  { id:'docs.sign',     name:'Sign documents',  desc:'Apply certification & digital signature.'             },
  { id:'saro.release',  name:'Release SARO',    desc:'Approve release of Special Allotment orders.'         },
  { id:'audit.view',    name:'View audit log',  desc:'Inspect the system-wide activity audit trail.'        },
  { id:'settings.edit', name:'Edit settings',   desc:'Modify system-wide configuration and defaults.'       },
]

export const BIS_ACTIVITY: ActivityItem[] = [
  { kind:'ok',   text:'Signed in from Senate HQ · Chrome on Windows',           when:'Today, 9:42',    ip:'10.14.22.98' },
  { kind:'ok',   text:'Certified <b>SARO-BMB-D-26-0042</b>',                    when:'Today, 8:51',    ip:'10.14.22.98' },
  { kind:'',     text:'Routed <b>BIS-2026-00412</b> to Office of Senate President', when:'Yesterday, 16:02', ip:'10.14.22.98' },
  { kind:'warn', text:'OTP re-enrollment · iPhone ending 2401',                  when:'14 Apr 2026',    ip:'10.14.22.98' },
  { kind:'ok',   text:'Password updated',                                         when:'02 Apr 2026',    ip:'10.14.22.98' },
  { kind:'err',  text:'Failed sign-in (wrong OTP) · device not trusted',         when:'28 Mar 2026',    ip:'203.177.49.12' },
  { kind:'',     text:'Invited by <b>Elena Reyes</b>',                           when:'12 Jan 2024',    ip:'—' },
]
