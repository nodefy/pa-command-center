import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = mockDb.clients.findById(id)
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(client)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const updated = mockDb.clients.update(id, {
    name: body.name,
    company: body.company ?? null,
    color: body.color,
    notes: body.notes ?? null,
    settings: body.settings ?? {},
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  mockDb.clients.archive(id)
  return NextResponse.json({ success: true })
}
