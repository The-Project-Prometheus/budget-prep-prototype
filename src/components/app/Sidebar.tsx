'use client'

import { useState, useRef, useEffect } from 'react'
import { NAV_TREE, CYCLES, type Cycle, type NavGroup, type NavNode } from '@/lib/nav-data'

interface Props {
  currentPage: string
  onNavigate: (pageId: string) => void
  onSignOut: () => void
  cycle: Cycle
  onCycleChange: (c: Cycle) => void
}

export default function Sidebar({ currentPage, onNavigate, onSignOut: _signOut, cycle, onCycleChange }: Props) {
  const defaultOpen = new Set(
    NAV_TREE.filter(n => n.kind === 'group' && (n as NavGroup).defaultOpen).map(n => n.id)
  )
  const [openGroups, setOpenGroups] = useState<Set<string>>(defaultOpen)

  // Auto-open parent when navigating to a child
  useEffect(() => {
    for (const node of NAV_TREE) {
      if (node.kind === 'group' && node.children.some(c => c.id === currentPage)) {
        setOpenGroups(prev => new Set(Array.from(prev).concat(node.id)))
        break
      }
    }
  }, [currentPage])

  function toggleGroup(id: string) {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Group by section
  const sections: Array<[string, NavNode[]]> = []
  for (const node of NAV_TREE) {
    const existing = sections.find(([s]) => s === node.section)
    if (existing) existing[1].push(node)
    else sections.push([node.section, [node]])
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <img src="/assets/senate_logo.png" alt="Senate" />
        <div>
          <div className="name">Senate of the Philippines</div>
          <div className="sub">Budget Info. System</div>
        </div>
      </div>

      {/* Cycle switcher */}
      <div className="cycle-switch-wrap">
        <CycleSwitcher cycle={cycle} onCycleChange={onCycleChange} />
      </div>

      {/* Nav */}
      <nav className="nav-scroll">
        {sections.map(([section, nodes]) => (
          <div key={section} className="nav-group">
            <label>{section}</label>
            {nodes.map((node: NavNode) => {
              if (node.kind === 'item') {
                const active = currentPage === node.id
                return (
                  <div
                    key={node.id}
                    className={`nav-item${active ? ' active' : ''}`}
                    onClick={() => onNavigate(node.id)}
                  >
                    <i className={node.icon} />
                    <span>{node.label}</span>
                    {node.badge && (
                      <span className={`nav-badge${node.badgeAlert && !active ? ' alert' : ''}`}>
                        {node.badge}
                      </span>
                    )}
                  </div>
                )
              }

              const group = node as NavGroup
              const isOpen = openGroups.has(group.id)
              const hasActive = group.children.some(c => c.id === currentPage)

              return (
                <div key={group.id}>
                  <div
                    className={`nav-parent${isOpen ? ' open' : ''}${hasActive ? ' has-active' : ''}`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <i className={group.icon} />
                    <span>{group.label}</span>
                    <i className="pi pi-chevron-right caret" />
                  </div>
                  <div className={`nav-children${isOpen ? ' open' : ''}`}>
                    {group.children.map(child => (
                      <div
                        key={child.id}
                        className={`nav-child${currentPage === child.id ? ' active' : ''}`}
                        onClick={() => onNavigate(child.id)}
                      >
                        {child.label}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-foot">
        <div className="env-pill">
          <span className="env-dot" />
          Production · v1.2.4
        </div>
      </div>
    </aside>
  )
}

function CycleSwitcher({ cycle, onCycleChange }: { cycle: Cycle; onCycleChange: (c: Cycle) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className={`cycle-switch${open ? ' open' : ''}`}
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        type="button"
      >
        <div className="cycle-switch-meta">
          <span className="cycle-switch-fy">{cycle.fy}</span>
          <span className={`cycle-switch-status s-${cycle.status.toLowerCase()}`}>{cycle.status}</span>
        </div>
        <div className="cycle-switch-phase">
          {cycle.phase} <span className="cycle-switch-note">· {cycle.note}</span>
        </div>
        <i className="pi pi-angle-down cycle-switch-caret" />
      </button>

      {open && (
        <div className="cycle-menu">
          <div className="cycle-menu-head">Switch budget cycle</div>
          {CYCLES.map(c => (
            <button
              key={c.id}
              className={`cycle-option${c.id === cycle.id ? ' on' : ''}`}
              onClick={() => { onCycleChange(c); setOpen(false) }}
              type="button"
            >
              <div className="cycle-option-fy">
                {c.fy}
                <span className={`cycle-option-status s-${c.status.toLowerCase()}`}>{c.status}</span>
              </div>
              <div className="cycle-option-phase">
                {c.phase} · <span className="muted">{c.note}</span>
              </div>
            </button>
          ))}
          <div className="cycle-menu-foot">
            <button className="textlink">View all cycles</button>
          </div>
        </div>
      )}
    </div>
  )
}
