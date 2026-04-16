'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, LayoutDashboard, Mail, Calendar, CheckSquare, Users, Clock, FileText } from 'lucide-react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'
import { cn } from '@/lib/utils'
import type { ElementType } from 'react'

type CommandItem = {
  label: string
  href: string
  icon: ElementType
  group: string
  subtitle?: string
  color?: string
  clientId?: string
}

const staticItems: CommandItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navigatie' },
  { label: 'E-mail', href: '/dashboard/mail', icon: Mail, group: 'Navigatie' },
  { label: 'Agenda', href: '/dashboard/agenda', icon: Calendar, group: 'Navigatie' },
  { label: 'Taken', href: '/dashboard/tasks', icon: CheckSquare, group: 'Navigatie' },
  { label: 'Uren', href: '/dashboard/time', icon: Clock, group: 'Navigatie' },
  { label: 'Documenten', href: '/dashboard/documents', icon: FileText, group: 'Navigatie' },
  { label: 'Klanten', href: '/dashboard/clients', icon: Users, group: 'Navigatie' },
]

export function CommandMenu() {
  const router = useRouter()
  const { commandOpen, setCommandOpen, clients, setActiveClient } = useSidebarStore(s => ({
    commandOpen: s.commandOpen,
    setCommandOpen: s.setCommandOpen,
    clients: s.clients,
    setActiveClient: s.setActiveClient,
  }))
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandOpen])

  useEffect(() => {
    if (commandOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelected(0)
    }
  }, [commandOpen])

  const clientItems: CommandItem[] = clients
    .filter(c => !c.archivedAt)
    .map(c => ({
      label: c.name,
      subtitle: c.company ?? undefined,
      href: `/dashboard/tasks?clientId=${c.id}`,
      icon: Users,
      group: 'Klanten',
      color: c.color,
      clientId: c.id,
    }))

  const allItems: CommandItem[] = [...staticItems, ...clientItems]

  const filtered = query
    ? allItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        (i.subtitle != null && i.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems

  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  const flatFiltered = Object.values(groups).flat()

  const handleSelect = (item: CommandItem) => {
    if (item.clientId) setActiveClient(item.clientId)
    router.push(item.href)
    setCommandOpen(false)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!commandOpen) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flatFiltered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && flatFiltered[selected]) handleSelect(flatFiltered[selected])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandOpen, selected, flatFiltered])

  if (!commandOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(15, 14, 12, 0.4)' }}
        onClick={() => setCommandOpen(false)}
      />

      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#FDFCFA', border: '1px solid #E0D9CE' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #EDE8DC' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#A09890' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            placeholder="Zoek of navigeer..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#0F0E0C' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs rounded px-1.5 py-0.5"
              style={{ color: '#A09890', background: '#EDE8DC' }}
            >
              wis
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-2">
          {flatFiltered.length === 0 ? (
            <p className="text-sm px-4 py-6 text-center" style={{ color: '#A09890' }}>
              Geen resultaten voor &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(groups).map(([groupName, items]) => {
              let idx = flatFiltered.indexOf(items[0])
              return (
                <div key={groupName}>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest px-4 pt-3 pb-1"
                    style={{ color: '#A09890' }}
                  >
                    {groupName}
                  </p>
                  {items.map((item) => {
                    const isSelected = flatFiltered[selected] === item
                    const Icon = item.icon
                    const currentIdx = idx++
                    return (
                      <button
                        key={item.href + item.label}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelected(currentIdx)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                        style={{
                          background: isSelected ? '#EDE8DC' : 'transparent',
                          color: isSelected ? '#0F0E0C' : '#3D3A34',
                        }}
                      >
                        {item.color ? (
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        ) : (
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A09890' }} />
                        )}
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.subtitle && (
                          <span className="text-xs" style={{ color: '#A09890' }}>{item.subtitle}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 text-[10px]"
          style={{ borderTop: '1px solid #EDE8DC', color: '#A09890' }}
        >
          <span><kbd className="font-mono">↑↓</kbd> navigeer</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">esc</kbd> sluit</span>
        </div>
      </div>
    </div>
  )
}
