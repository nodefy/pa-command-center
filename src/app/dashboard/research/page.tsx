import { Search, FileText, Plus } from 'lucide-react'

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A09890' }}>Module</p>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
            Research
          </h1>
        </div>
        <button
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors mt-1"
          style={{ background: '#1A3A2A', color: '#F5F0E8' }}
        >
          <Plus className="w-4 h-4" />
          Nieuw onderzoek
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#A09890' }} />
        <input
          type="search"
          placeholder="Zoek in research..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none"
          style={{ background: '#FFFFFF', border: '1px solid #E0D9CE', color: '#0F0E0C' }}
        />
      </div>

      {/* Empty state */}
      <div
        className="rounded-2xl p-16 text-center border-2 border-dashed"
        style={{ borderColor: '#E0D9CE' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
          style={{ background: '#EDE8DC' }}
        >
          <FileText className="w-6 h-6" style={{ color: '#A09890' }} />
        </div>
        <p className="text-sm font-semibold mb-1" style={{ color: '#0F0E0C' }}>Nog geen research</p>
        <p className="text-xs" style={{ color: '#A09890' }}>Maak je eerste research-document aan voor een klant</p>
      </div>
    </div>
  )
}
