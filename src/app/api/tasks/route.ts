import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId') ?? undefined
  const status = searchParams.get('status') ?? undefined
  return NextResponse.json(mockDb.tasks.findAll(clientId, status))
}

export async function POST(req: Request) {
  const body = await req.json()
  const { clientId, title, description, priority, dueDate, status } = body
  if (!clientId || !title) return NextResponse.json({ error: 'clientId and title required' }, { status: 400 })

  const task = mockDb.tasks.create({
    clientId,
    title,
    description: description ?? null,
    status: status ?? 'todo',
    priority: priority ?? 'normal',
    dueDate: dueDate ?? null,
  })
  return NextResponse.json(task, { status: 201 })
}
