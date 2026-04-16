'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Trash2 } from 'lucide-react'

type Client = {
  id: string
  name: string
  company: string | null
  color: string
  notes: string | null
  archivedAt: string | null
  settings: {
    communicationTone?: string
    emailInstructions?: string
  }
}

const COLOR_OPTIONS = [
  { hex: '#1B4F72', name: 'Donkerblauw' },
  { hex: '#2E86C1', name: 'Blauw' },
  { hex: '#27AE60', name: 'Groen' },
  { hex: '#F39C12', name: 'Oranje' },
  { hex: '#E74C3C', name: 'Rood' },
  { hex: '#8E44AD', name: 'Paars' },
  { hex: '#16A085', name: 'Teal' },
  { hex: '#D35400', name: 'Bruin' },
  { hex: '#2C3E50', name: 'Antraciet' },
  { hex: '#7F8C8D', name: 'Grijs' },
]

export default function ClientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.clientId as string

  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    company: '',
    color: '#1B4F72',
    notes: '',
    emailInstructions: '',
    communicationTone: 'formal',
  })

  useEffect(() => {
    fetch(`/api/clients/${clientId}`)
      .then(r => r.json())
      .then((data: Client) => {
        setClient(data)
        setForm({
          name: data.name,
          company: data.company || '',
          color: data.color,
          notes: data.notes || '',
          emailInstructions: data.settings?.emailInstructions || '',
          communicationTone: data.settings?.communicationTone || 'formal',
        })
        setLoading(false)
      })
      .catch(() => {
        setError('Klant niet gevonden')
        setLoading(false)
      })
  }, [clientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
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

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm(`Weet je zeker dat je ${client?.name} wilt archiveren?`)) return

    await fetch(`/api/clients/${clientId}`, { method: 'DELETE' })
    router.push('/dashboard/clients')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-sm text-[#7F8C8D] py-8 text-center">Laden...</div>
      </div>
    )
  }

  if (error && !client) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-sm text-[#E74C3C] py-8 text-center">{error}</div>
      </div>
    )
  }

  const initials = form.name ? form.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/clients"
          className="flex items-center gap-1.5 text-sm text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Klanten
        </Link>
        <span className="text-[#BDC3C7]">/</span>
        <span className="text-sm text-[#2C3E50] font-medium">{client?.name}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 transition-colors"
                style={{ backgroundColor: form.color }}
              >
                {initials}
              </div>
              <div>
                <p className="font-semibold text-[#2C3E50] text-lg">{form.name || 'Naam klant'}</p>
                {form.company && <p className="text-sm text-[#7F8C8D]">{form.company}</p>}
                {client?.archivedAt && (
                  <span className="inline-block mt-1 text-xs text-[#E74C3C] bg-red-50 px-2 py-0.5 rounded-full">
                    Gearchiveerd
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#7F8C8D] uppercase tracking-wide">Basisinformatie</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                  Naam <span className="text-[#E74C3C]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent transition-all placeholder:text-[#BDC3C7]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">
                  Bedrijf
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Acme B.V."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent transition-all placeholder:text-[#BDC3C7]"
                />
              </div>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">Kleur</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.hex}
                  type="button"
                  title={opt.name}
                  onClick={() => setForm(f => ({ ...f, color: opt.hex }))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4F72]"
                  style={{ backgroundColor: opt.hex }}
                >
                  {form.color === opt.hex && (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Communication settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#7F8C8D] uppercase tracking-wide">Communicatie</h3>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">Tone of voice</label>
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
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      form.communicationTone === opt.value
                        ? 'bg-[#EBF5FB] border-[#1B4F72] text-[#1B4F72] font-medium'
                        : 'border-gray-200 text-[#7F8C8D] hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">E-mail instructies</label>
              <textarea
                value={form.emailInstructions}
                onChange={e => setForm(f => ({ ...f, emailInstructions: e.target.value }))}
                placeholder="Bijv: altijd cc naar assistent@bedrijf.nl..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent transition-all placeholder:text-[#BDC3C7] resize-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">Notities</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Achtergrondinfo, voorkeuren, bijzonderheden..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F72] focus:border-transparent transition-all placeholder:text-[#BDC3C7] resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-[#E74C3C]">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleArchive}
              className="flex items-center gap-1.5 text-sm text-[#7F8C8D] hover:text-[#E74C3C] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Archiveer klant
            </button>

            <div className="flex items-center gap-3">
              {saved && (
                <span className="flex items-center gap-1 text-sm text-[#27AE60]">
                  <Check className="w-3.5 h-3.5" />
                  Opgeslagen
                </span>
              )}
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#154360] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
