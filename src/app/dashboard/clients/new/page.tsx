'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

const COLOR_OPTIONS = [
  { hex: '#1B4F72', name: 'Donkerblauw' },
  { hex: '#1A3A2A', name: 'Bosgroen' },
  { hex: '#27AE60', name: 'Groen' },
  { hex: '#C4622D', name: 'Oranje' },
  { hex: '#C0392B', name: 'Rood' },
  { hex: '#7C3AED', name: 'Paars' },
  { hex: '#0F766E', name: 'Teal' },
  { hex: '#8E44AD', name: 'Violet' },
  { hex: '#3D3A34', name: 'Antraciet' },
  { hex: '#A09890', name: 'Taupe' },
]

const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid #E0D9CE',
  color: '#0F0E0C',
  outline: 'none',
}

export default function NewClientPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    company: '',
    color: '#1B4F72',
    notes: '',
    emailInstructions: '',
    communicationTone: 'formal',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim() || null,
          color: form.color,
          notes: form.notes.trim() || null,
          settings: {
            communicationTone: form.communicationTone,
            emailInstructions: form.emailInstructions.trim() || null,
          },
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Er ging iets mis')
      }
      router.push('/dashboard/clients')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
      setSaving(false)
    }
  }

  const initials = form.name ? form.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/dashboard/clients"
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: '#A09890' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Klanten
        </Link>
        <span style={{ color: '#D6CFBF' }}>/</span>
        <span className="text-sm font-medium" style={{ color: '#0F0E0C' }}>Nieuwe klant</span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #E0D9CE', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        {/* Preview header */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid #EDE8DC', background: '#FDFCFA' }}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 transition-all"
              style={{ backgroundColor: form.color }}
            >
              {initials}
            </div>
            <div>
              <p className="font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C', fontSize: 18 }}>
                {form.name || 'Naam klant'}
              </p>
              {form.company && <p className="text-sm" style={{ color: '#A09890' }}>{form.company}</p>}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#A09890' }}>
              Basisinformatie
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                  Naam <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jan Jansen"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                  Bedrijf
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Acme B.V."
                  className="w-full px-3 py-2 text-sm rounded-lg transition-all"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>Kleur</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.hex}
                  type="button"
                  title={opt.name}
                  onClick={() => setForm(f => ({ ...f, color: opt.hex }))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: opt.hex }}
                >
                  {form.color === opt.hex && (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Communication */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#A09890' }}>
              Communicatie
            </p>

            <div className="mb-3">
              <label className="block text-xs font-medium mb-2" style={{ color: '#6B6560' }}>Tone of voice</label>
              <div className="flex gap-2">
                {[
                  { value: 'formal', label: 'Formeel' },
                  { value: 'semi-formal', label: 'Semi-formeel' },
                  { value: 'informal', label: 'Informeel' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, communicationTone: opt.value }))}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                    style={{
                      background: form.communicationTone === opt.value ? '#1A3A2A' : '#F5F0E8',
                      color: form.communicationTone === opt.value ? '#F5F0E8' : '#6B6560',
                      border: 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>
                E-mail instructies
              </label>
              <textarea
                value={form.emailInstructions}
                onChange={e => setForm(f => ({ ...f, emailInstructions: e.target.value }))}
                placeholder="Bijv: altijd cc naar assistent@bedrijf.nl, begin met 'Geachte heer/mevrouw'..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-lg resize-none transition-all"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6560' }}>Notities</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Achtergrondinfo, voorkeuren, bijzonderheden..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-lg resize-none transition-all"
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#C0392B' }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard/clients"
              className="text-sm transition-colors"
              style={{ color: '#A09890' }}
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#1A3A2A', color: '#F5F0E8' }}
            >
              {saving ? 'Opslaan...' : 'Klant aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
