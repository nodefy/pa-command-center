'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Mail, Calendar, CheckSquare,
  Users, FileText, Search, Clock, Plus, ChevronDown
} from 'lucide-react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Image from 'next/image'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/mail', icon: Mail, label: 'E-mail' },
  { href: '/dashboard/agenda', icon: Calendar, label: 'Agenda' },
  { href: '/dashboard/tasks', icon: CheckSquare, label: 'Taken' },
  { href: '/dashboard/time', icon: Clock, label: 'Uren' },
  { href: '/dashboard/research', icon: Search, label: 'Research' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documenten' },
  { href: '/dashboard/clients', icon: Users, label: 'Klanten' },
]

function formatTimer(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [clientsOpen, setClientsOpen] = useState(true)

  const {
    clients, activeClientId, setActiveClient,
    timerRunning, timerSeconds, timerClientId,
    startTimer, stopTimer
  } = useSidebarStore(s => ({
    clients: s.clients,
    activeClientId: s.activeClientId,
    setActiveClient: s.setActiveClient,
    timerRunning: s.timerRunning,
    timerSeconds: s.timerSeconds,
    timerClientId: s.timerClientId,
    startTimer: s.startTimer,
    stopTimer: s.stopTimer,
  }))

  const activeClients = clients.filter(c => !c.archivedAt)

  return (
    <aside className="w-52 flex-shrink-0 flex flex-col h-screen border-r"
      style={{ background: '#EDE8DC', borderColor: '#D6CFBF' }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-base font-semibold leading-tight mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
          Megan&apos;s Command Center
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: '#A09890' }}>by</span>
          <Image
            src="https://res.cloudinary.com/dnjbtlwz9/image/upload/v1773585457/NODEFY_full_RGB_black_1_hieyp6.png"
            alt="Nodefy"
            width={52}
            height={16}
            unoptimized
            style={{ opacity: 0.45 }}
          />
        </div>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: '#A09890' }}>Menu</p>

        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'font-medium shadow-sm'
                  : 'hover:bg-black/5'
              )}
              style={isActive
                ? { background: '#FFFFFF', color: '#0F0E0C', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { color: '#3D3A34' }
              }
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </Link>
          )
        })}

        {/* Klanten sectie */}
        <div className="pt-4">
          <button
            onClick={() => setClientsOpen(o => !o)}
            className="flex items-center justify-between w-full px-2 mb-1.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#A09890' }}>Klanten</p>
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard/clients/new"
                onClick={e => e.stopPropagation()}
                className="p-0.5 rounded hover:bg-black/10 transition-colors"
                style={{ color: '#A09890' }}
                title="Nieuwe klant"
              >
                <Plus className="w-3 h-3" />
              </Link>
              <ChevronDown
                className={cn('w-3 h-3 transition-transform', !clientsOpen && '-rotate-90')}
                style={{ color: '#A09890' }}
              />
            </div>
          </button>

          {clientsOpen && (
            <div className="space-y-0.5">
              {activeClients.length === 0 ? (
                <p className="text-xs px-2 py-1" style={{ color: '#A09890' }}>Geen klanten</p>
              ) : (
                activeClients.map((client, i) => {
                  const isActive = activeClientId === client.id
                  const isTimerClient = timerClientId === client.id
                  return (
                    <button
                      key={client.id}
                      onClick={() => {
                        setActiveClient(client.id)
                        router.push(`/dashboard/tasks?clientId=${client.id}`)
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all text-left',
                        isActive ? 'shadow-sm' : 'hover:bg-black/5'
                      )}
                      style={isActive
                        ? { background: '#FFFFFF', color: '#0F0E0C', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                        : { color: '#3D3A34' }
                      }
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: client.color }} />
                      <span className="flex-1 truncate text-sm">{client.name}</span>
                      <div className="flex items-center gap-1">
                        {isTimerClient && timerRunning && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                        )}
                        <span className="text-[10px] font-mono" style={{ color: '#A09890' }}>{i + 1}</span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Timer widget onderaan */}
      <div className="px-3 pb-3">
        <div
          className="rounded-xl p-3"
          style={{ background: timerRunning ? '#1A3A2A' : '#D6CFBF' }}
        >
          {timerRunning ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-green-300">● Live timer</span>
                {timerClientId && (
                  <span className="text-[10px] text-green-400 truncate max-w-[80px]">
                    {clients.find(c => c.id === timerClientId)?.name}
                  </span>
                )}
              </div>
              <div className="text-2xl font-mono font-semibold text-white mb-2 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <button
                onClick={stopTimer}
                className="w-full text-xs font-medium py-1.5 rounded-lg transition-all"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}
              >
                Stop
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B6560' }}>Timer</span>
                {timerSeconds > 0 && (
                  <span className="text-[10px] font-mono" style={{ color: '#6B6560' }}>{formatTimer(timerSeconds)}</span>
                )}
              </div>
              <button
                onClick={() => startTimer(activeClientId ?? undefined)}
                className="w-full text-xs font-medium py-1.5 rounded-lg transition-all"
                style={{ background: '#0F0E0C', color: '#F5F0E8' }}
              >
                ▶ Start timer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderTop: '1px solid #D6CFBF' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ background: '#1A3A2A' }}>
          PA
        </div>
        <span className="text-xs truncate" style={{ color: '#6B6560' }}>Mijn account</span>
      </div>
    </aside>
  )
}
