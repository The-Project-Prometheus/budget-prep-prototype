'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export interface PvOption {
  code?: string
  name?: string
  type?: string
  sub?: string
  [key: string]: unknown
}

interface Props {
  options: PvOption[]
  optionLabel?: string
  optionValue?: string
  value?: string | null
  placeholder?: string
  filterPlaceholder?: string
  filter?: boolean
  onChange?: (value: string, option: PvOption | null) => void
}

export default function PvDropdown({
  options,
  optionLabel = 'name',
  optionValue = 'code',
  value = null,
  placeholder = 'Select…',
  filterPlaceholder = 'Search…',
  filter = true,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [focusIdx, setFocusIdx] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLInputElement>(null)

  const getVal = (o: PvOption) => String(o[optionValue] ?? o)
  const getLbl = (o: PvOption) => String(o[optionLabel] ?? o)
  const findOpt = (v: string | null) => options.find(o => getVal(o) === v) ?? null

  const filtered = filterText
    ? options.filter(o => {
        const text = `${o.code ?? ''} ${o.name ?? ''} ${o.type ?? ''} ${o.sub ?? ''}`.toLowerCase()
        return text.includes(filterText.toLowerCase())
      })
    : options

  const selected = findOpt(value ?? null)

  function commit(v: string) {
    onChange?.(v, findOpt(v))
    setOpen(false)
    setFilterText('')
  }

  function openPanel() {
    setOpen(true)
    setFocusIdx(Math.max(0, filtered.findIndex(o => getVal(o) === value)))
    setTimeout(() => filterRef.current?.focus(), 0)
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open && ['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); openPanel(); return }
    if (!open) return
    if (e.key === 'Escape')    { e.preventDefault(); setOpen(false) }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(i => Math.min(filtered.length - 1, i + 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocusIdx(i => Math.max(0, i - 1)) }
    if (e.key === 'Enter') {
      e.preventDefault()
      const o = filtered[focusIdx]
      if (o) commit(getVal(o))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, focusIdx])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`p-dropdown${open ? ' p-dropdown-open' : ''}`}
      tabIndex={0}
      role="combobox"
      aria-expanded={open}
      onKeyDown={handleKeyDown}
      onClick={() => open ? setOpen(false) : openPanel()}
    >
      {/* Label */}
      <span className={`p-dropdown-label${!selected ? ' p-placeholder' : ''}`}>
        {selected
          ? selected.code
            ? <>
                <span className="p-dropdown-item-code">{selected.code as string}</span>
                <span className="p-dropdown-item-name">{selected.name as string}</span>
              </>
            : getLbl(selected)
          : placeholder
        }
      </span>

      {/* Trigger */}
      <div className="p-dropdown-trigger">
        <i className="pi pi-chevron-down p-dropdown-trigger-icon" />
      </div>

      {/* Hidden value */}
      <input type="hidden" className="p-dropdown-hidden" value={value ?? ''} readOnly />

      {/* Panel */}
      {open && (
        <div className="p-dropdown-panel show" role="listbox" onClick={e => e.stopPropagation()}>
          {filter && (
            <div className="p-dropdown-header">
              <div className="p-dropdown-filter-container">
                <i className="p-dropdown-filter-icon pi pi-search" />
                <input
                  ref={filterRef}
                  className="p-dropdown-filter"
                  type="text"
                  placeholder={filterPlaceholder}
                  value={filterText}
                  onChange={e => { setFilterText(e.target.value); setFocusIdx(0) }}
                  onKeyDown={e => {
                    if (['ArrowDown','ArrowUp','Enter','Escape'].includes(e.key)) {
                      e.preventDefault()
                      handleKeyDown(e as unknown as React.KeyboardEvent)
                    }
                  }}
                />
              </div>
            </div>
          )}
          <div className="p-dropdown-items-wrapper">
            <ul className="p-dropdown-items">
              {filtered.length === 0 && (
                <li className="p-dropdown-empty-message">No results</li>
              )}
              {filtered.map((o, i) => {
                const v = getVal(o)
                const isSel = v === value
                const isFocus = i === focusIdx
                return (
                  <li
                    key={v}
                    className={`p-dropdown-item${isSel ? ' p-highlight' : ''}${isFocus ? ' p-focus' : ''}`}
                    role="option"
                    aria-selected={isSel}
                    onClick={() => commit(v)}
                    onMouseEnter={() => setFocusIdx(i)}
                  >
                    {o.code
                      ? <>
                          <span className="p-dropdown-item-code-cell">{o.code as string}</span>
                          <span className="p-dropdown-item-name-cell">{o.name as string}</span>
                          {o.type && <span className="p-dropdown-item-type-cell">{o.type as string}</span>}
                        </>
                      : <><span /><span className="p-dropdown-item-name-cell">{getLbl(o)}</span><span /></>
                    }
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
