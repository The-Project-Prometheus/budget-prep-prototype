'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'

interface ToastCtx {
  show: (msg: string, icon?: string) => void
}

const Ctx = createContext<ToastCtx>({ show: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('')
  const [icon, setIcon] = useState('pi-check-circle')
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((m: string, ic = 'pi-check-circle') => {
    setMsg(m)
    setIcon(ic)
    setVisible(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2800)
  }, [])

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className={`toast${visible ? ' show' : ''}`}>
        <i className={`pi ${icon}`} />
        <span>{msg}</span>
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  return ctx.show
}
