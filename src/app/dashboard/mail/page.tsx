import { Mail, Inbox, Send, Star, Archive } from 'lucide-react'

export default function MailPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A09890' }}>Module</p>
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
          E-mail
        </h1>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E0D9CE', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="flex" style={{ height: 560 }}>
          {/* Left nav */}
          <div className="w-48 flex-shrink-0 flex flex-col p-3 gap-0.5" style={{ background: '#F5F0E8', borderRight: '1px solid #E0D9CE' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: '#A09890' }}>Inbox</p>
            {[
              { icon: Inbox, label: 'Inbox', count: 0 },
              { icon: Send, label: 'Verzonden' },
              { icon: Star, label: 'Belangrijk' },
              { icon: Archive, label: 'Archief' },
            ].map(({ icon: Icon, label, count }) => (
              <button
                key={label}
                className="flex items-center gap-2.5 px-2.5 py-1.5 text-sm rounded-lg text-left transition-colors hover:bg-black/5"
                style={{ color: '#3D3A34' }}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A09890' }} />
                <span className="flex-1">{label}</span>
                {count !== undefined && (
                  <span className="text-[10px] font-mono" style={{ color: '#A09890' }}>{count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#EDE8DC' }}
            >
              <Mail className="w-6 h-6" style={{ color: '#6B6560' }} />
            </div>
            <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
              Gmail nog niet gekoppeld
            </h3>
            <p className="text-sm mb-5 max-w-xs" style={{ color: '#6B6560' }}>
              Koppel een Gmail-account om e-mails te lezen en te versturen voor al je klanten.
            </p>
            <button
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              style={{ background: '#1A3A2A', color: '#F5F0E8' }}
            >
              Gmail koppelen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
