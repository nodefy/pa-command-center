import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function GET() {
  return NextResponse.json(mockDb.clients.findAll())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, company, color, notes, settings } = body
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const client = mockDb.clients.create({
    name,
    company: company ?? null,
    color: color ?? '#1B4F72',
    notes: notes ?? null,
    archivedAt: null,
    settings: settings ?? {},
  })
  return NextResponse.json(client, { status: 201 })
}
