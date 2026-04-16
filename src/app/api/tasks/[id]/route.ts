import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const updated = mockDb.tasks.update(id, {
    ...(body.title !== undefined && { title: body.title }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.status !== undefined && { status: body.status }),
    ...(body.priority !== undefined && { priority: body.priority }),
    ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
    ...(body.status === 'done' && { completedAt: new Date().toISOString() }),
    ...(body.status && body.status !== 'done' && { completedAt: null }),
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  mockDb.tasks.delete(id)
  return NextResponse.json({ success: true })
}
