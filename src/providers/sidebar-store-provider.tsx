'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

export type Client = {
  id: string
  name: string
  company: string | null
  color: string
  archivedAt: string | null
}

type SidebarCtx = {
  clients: Client[]
  activeClientId: string | null
  commandOpen: boolean
  setClients: (clients: Client[]) => void
  setActiveClient: (id: string | null) => void
  setCommandOpen: (open: boolean) => void
  // Timer
  timerRunning: boolean
  timerSeconds: number
  timerClientId: string | null
  timerDescription: string
  startTimer: (clientId?: string) => void
  stopTimer: () => void
  resetTimer: () => void
  setTimerClientId: (id: string | null) => void
  setTimerDescription: (desc: string) => void
}

const SidebarContext = createContext<SidebarCtx | null>(null)

export function SidebarStoreProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [activeClientId, setActiveClient] = useState<string | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerClientId, setTimerClientId] = useState<string | null>(null)
  const [timerDescription, setTimerDescription] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  const startTimer = (clientId?: string) => {
    if (clientId) setTimerClientId(clientId)
    setTimerRunning(true)
  }

  const stopTimer = () => setTimerRunning(false)

  const resetTimer = () => {
    setTimerRunning(false)
    setTimerSeconds(0)
    setTimerDescription('')
  }

  return (
    <SidebarContext.Provider value={{
      clients, activeClientId, commandOpen,
      setClients, setActiveClient, setCommandOpen,
      timerRunning, timerSeconds, timerClientId, timerDescription,
      startTimer, stopTimer, resetTimer, setTimerClientId, setTimerDescription,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarStore<T>(selector: (store: SidebarCtx) => T): T {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebarStore must be used within SidebarStoreProvider')
  return selector(ctx)
}
