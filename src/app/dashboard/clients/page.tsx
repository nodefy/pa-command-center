import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ClientList } from '@/components/clients/ClientList'

export default function ClientsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A09890' }}>Module</p>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
            Klanten
          </h1>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors mt-1"
          style={{ background: '#1A3A2A', color: '#F5F0E8' }}
        >
          <Plus className="w-4 h-4" />
          Nieuwe klant
        </Link>
      </div>
      <ClientList />
    </div>
  )
}
