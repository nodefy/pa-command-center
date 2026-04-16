'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Archive, Settings, CheckSquare } from 'lucide-react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'

type Client = {
  id: string
  name: string
  company: string | null
  color: string
  archivedAt: string | null
  notes: string | null
  settings: Record<string, unknown>
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const { setClients: setStoreClients, setActiveClient } = useSidebarStore(s => ({
    setClients: s.setClients,
    setActiveClient: s.setActiveClient,
  }))
  const router = useRouter()

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => {
        setClients(data)
        setStoreClients(data)
        setLoading(false)
      })
  }, []) // eslint-disable-line

  const archive = async (id: string) => {
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    setClients(prev => prev.map(c => c.id === id ? { ...c, archivedAt: new Date().toISOString() } : c))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#D6CFBF', animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  const active = clients.filter(c => !c.archivedAt)
  const archived = clients.filter(c => c.archivedAt)

  return (
    <div className="space-y-2">
      {active.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border-2 border-dashed"
          style={{ borderColor: '#E0D9CE' }}
        >
          <p className="text-sm mb-3" style={{ color: '#6B6560' }}>Nog geen klanten</p>
          <Link
            href="/dashboard/clients/new"
            className="text-sm font-medium transition-colors"
            style={{ color: '#1A3A2A' }}
          >
            Voeg je eerste klant toe →
          </Link>
        </div>
      ) : (
        active.map(client => (
          <div
            key={client.id}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E0D9CE',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {/* Color avatar */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              style={{ backgroundColor: client.color }}
            >
              {client.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm" style={{ color: '#0F0E0C' }}>{client.name}</p>
              {client.company && (
                <p className="text-xs mt-0.5" style={{ color: '#A09890' }}>{client.company}</p>
              )}
            </div>

            {/* Actions — show on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setActiveClient(client.id)
                  router.push(`/dashboard/tasks?clientId=${client.id}`)
                }}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: '#6B6560' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = '#F5F0E8'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#0F0E0C'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = ''
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#6B6560'
                }}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Taken
              </button>
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: '#6B6560' }}
              >
                <Settings className="w-3.5 h-3.5" />
                Bewerken
              </Link>
              <button
                onClick={() => archive(client.id)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#A09890' }}
                title="Archiveer"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))
      )}

      {archived.length > 0 && (
        <details className="mt-4">
          <summary
            className="text-xs cursor-pointer select-none transition-colors"
            style={{ color: '#A09890' }}
          >
            {archived.length} gearchiveerde klant{archived.length !== 1 ? 'en' : ''}
          </summary>
          <div className="mt-2 space-y-1.5">
            {archived.map(client => (
              <div
                key={client.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-50"
                style={{ background: '#F5F0E8', border: '1px solid #E0D9CE' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ backgroundColor: client.color }}
                >
                  {client.name.charAt(0)}
                </div>
                <span className="text-sm" style={{ color: '#6B6560' }}>{client.name}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
