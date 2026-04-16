import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

const mockEvents = [
  { day: 9, title: 'Call Sarah – Q2 review', time: '10:00', color: '#1B4F72', duration: 60 },
  { day: 9, title: 'Lunch Mark Janssen', time: '12:30', color: '#27AE60', duration: 90 },
  { day: 11, title: 'Vluchten boeken Berlijn', time: '14:00', color: '#8E44AD', duration: 30 },
  { day: 14, title: 'Contracten doornemen', time: '09:00', color: '#27AE60', duration: 45 },
  { day: 16, title: 'PA-bijeenkomst', time: '11:00', color: '#C4622D', duration: 60 },
]

export default function AgendaPage() {
  const today = 15 // April 15

  // Build a simple April 2026 grid (starts on Wednesday = index 2)
  const startOffset = 2
  const daysInMonth = 30
  const cells: (number | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A09890' }}>Module</p>
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
          Agenda
        </h1>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E0D9CE', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #EDE8DC' }}>
          <button className="p-1.5 rounded-lg transition-colors hover:bg-[#F5F0E8]" style={{ color: '#6B6560' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold" style={{ color: '#0F0E0C' }}>April 2026</span>
          <button className="p-1.5 rounded-lg transition-colors hover:bg-[#F5F0E8]" style={{ color: '#6B6560' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 px-4 pt-3 pb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#A09890' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="px-4 pb-4">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                const isToday = day === today
                const events = day ? mockEvents.filter(e => e.day === day) : []
                return (
                  <div
                    key={di}
                    className="relative p-1.5 min-h-[72px] rounded-lg transition-colors"
                    style={{ cursor: day ? 'pointer' : 'default' }}
                  >
                    {day && (
                      <>
                        <span
                          className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1"
                          style={{
                            background: isToday ? '#1A3A2A' : 'transparent',
                            color: isToday ? '#FFFFFF' : day < today ? '#C0B9AE' : '#0F0E0C',
                          }}
                        >
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {events.slice(0, 2).map((ev, i) => (
                            <div
                              key={i}
                              className="text-[9px] font-medium px-1 py-0.5 rounded truncate leading-tight"
                              style={{ background: ev.color + '20', color: ev.color }}
                            >
                              {ev.time} {ev.title}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-[9px] px-1" style={{ color: '#A09890' }}>
                              +{events.length - 2} meer
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A09890' }}>Aankomend</p>
        <div className="space-y-2">
          {mockEvents.filter(e => e.day >= today).slice(0, 3).map((ev, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#FFFFFF', border: '1px solid #E0D9CE' }}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: '#0F0E0C' }}>{ev.title}</p>
                <p className="text-xs" style={{ color: '#A09890' }}>
                  {ev.day} april · {ev.time} · {ev.duration}min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
