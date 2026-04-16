'use client'

import { Search, ChevronDown } from 'lucide-react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function TopBar() {
  const router = useRouter()
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { activeClientId, clients, setCommandOpen, setActiveClient } = useSidebarStore(s => ({
    activeClientId: s.activeClientId,
    clients: s.clients,
    setCommandOpen: s.setCommandOpen,
    setActiveClient: s.setActiveClient,
  }))

  const activeClient = clients.find(c => c.id === activeClientId)
  const activeClients = clients.filter(c => !c.archivedAt)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setSwitcherOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-12 flex items-center px-5 gap-3 flex-shrink-0"
      style={{ background: '#F5F0E8', borderBottom: '1px solid #E0D9CE' }}>

      {/* Client switcher */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setSwitcherOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: activeClient ? activeClient.color + '18' : '#E0D9CE',
            color: activeClient ? activeClient.color : '#6B6560',
            border: `1px solid ${activeClient ? activeClient.color + '30' : '#D6CFBF'}`,
          }}
        >
          {activeClient ? (
            <>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeClient.color }} />
              <span>{activeClient.name}</span>
            </>
          ) : (
            <span style={{ color: '#6B6560' }}>Alle klanten</span>
          )}
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>

        {switcherOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-52 rounded-xl shadow-lg z-50 overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #E0D9CE' }}>
            <div className="p-1">
              <button
                onClick={() => { setActiveClient(null); setSwitcherOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left hover:bg-gray-50"
                style={{ color: activeClientId === null ? '#0F0E0C' : '#6B6560' }}
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                <span>Alle klanten</span>
                {activeClientId === null && <span className="ml-auto text-[10px] text-gray-400">✓</span>}
              </button>

              {activeClients.length > 0 && (
                <div className="my-1" style={{ borderTop: '1px solid #F0EDE8' }} />
              )}

              {activeClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => {
                    setActiveClient(client.id)
                    setSwitcherOpen(false)
                    router.push(`/dashboard/tasks?clientId=${client.id}`)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left hover:bg-gray-50"
                  style={{ color: '#0F0E0C' }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: client.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{client.name}</p>
                    {client.company && <p className="text-xs truncate" style={{ color: '#A09890' }}>{client.company}</p>}
                  </div>
                  {activeClientId === client.id && <span className="text-[10px]" style={{ color: '#A09890' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search trigger */}
      <button
        onClick={() => setCommandOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
        style={{
          background: '#EDE8DC',
          color: '#A09890',
          border: '1px solid #D6CFBF',
        }}
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Zoek of spring naar...</span>
        <kbd className="text-[10px] rounded px-1 py-0.5 font-mono ml-1"
          style={{ background: '#D6CFBF', color: '#6B6560' }}>⌘K</kbd>
      </button>
    </header>
  )
}
