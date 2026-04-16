import Link from 'next/link'
import { CheckSquare, Mail, Calendar, Users, Clock, FileText, Search, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest font-semibold mb-2 capitalize" style={{ color: '#A09890' }}>
          {today}
        </p>
        <h1 className="text-4xl font-semibold leading-tight" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
          Goedemorgen
        </h1>
        <p className="text-base mt-2" style={{ color: '#6B6560' }}>
          Hier is een overzicht van wat er vandaag speelt.
        </p>
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
        {[
          { href: '/dashboard/mail', icon: Mail, label: 'E-mail', sub: 'Inbox & opstellen', color: '#1B4F72' },
          { href: '/dashboard/tasks', icon: CheckSquare, label: 'Taken', sub: 'Kanban & to-do', color: '#1A3A2A' },
          { href: '/dashboard/agenda', icon: Calendar, label: 'Agenda', sub: 'Afspraken & events', color: '#7C3AED' },
          { href: '/dashboard/time', icon: Clock, label: 'Uren', sub: 'Timer & registratie', color: '#C4622D' },
          { href: '/dashboard/clients', icon: Users, label: 'Klanten', sub: 'Beheer & overzicht', color: '#0F766E' },
          { href: '/dashboard/documents', icon: FileText, label: 'Documenten', sub: 'Bestanden & notities', color: '#A09890' },
        ].map(({ href, icon: Icon, label, sub, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E0D9CE',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: color + '15' }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#0F0E0C' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#A09890' }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions + tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aan de slag */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#FFFFFF', border: '1px solid #E0D9CE' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#A09890' }}>Aan de slag</p>
          <div className="space-y-1">
            {[
              { label: 'Voeg je eerste klant toe', href: '/dashboard/clients/new' },
              { label: 'Maak je eerste taak aan', href: '/dashboard/tasks' },
              { label: 'Start een timer', href: '/dashboard/time' },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group hover:bg-[#F5F0E8]"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors"
                  style={{ borderColor: '#D6CFBF' }}
                />
                <span className="text-sm flex-1" style={{ color: '#3D3A34' }}>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#A09890' }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Keyboard tip */}
        <div
          className="rounded-xl p-5 flex flex-col justify-between"
          style={{ background: '#1A3A2A' }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Snelkoppelingen
            </p>
            <div className="space-y-2.5">
              {[
                { keys: '⌘K', label: 'Zoeken & navigeren' },
                { keys: '⌘1–8', label: 'Module switchen' },
                { keys: 'Esc', label: 'Menu sluiten' },
              ].map(({ keys, label }) => (
                <div key={keys} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
                  <kbd
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>PA Command Center v1.0</p>
        </div>
      </div>
    </div>
  )
}
