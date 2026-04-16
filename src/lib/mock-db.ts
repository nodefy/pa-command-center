/**
 * In-memory mock database — no real DB needed.
 * State lives in module scope (persists across hot reloads in dev).
 */

export type MockClient = {
  id: string
  name: string
  company: string | null
  color: string
  archivedAt: string | null
  notes: string | null
  settings: Record<string, unknown>
  createdAt: string
}

export type MockTask = {
  id: string
  clientId: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  completedAt: string | null
  createdAt: string
}

const g = globalThis as unknown as {
  _mockClients?: MockClient[]
  _mockTasks?: MockTask[]
}

// Seed data
if (!g._mockClients) {
  g._mockClients = [
    {
      id: 'client-1',
      name: 'Sarah van den Berg',
      company: 'TechVision B.V.',
      color: '#1B4F72',
      archivedAt: null,
      notes: 'Directeur, voorkeur voor korte updates.',
      settings: { communicationTone: 'formal', emailInstructions: 'Altijd cc naar secretariaat' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'client-2',
      name: 'Mark Janssen',
      company: 'Janssen Advies',
      color: '#27AE60',
      archivedAt: null,
      notes: null,
      settings: { communicationTone: 'informal', emailInstructions: '' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'client-3',
      name: 'Lisa de Vries',
      company: null,
      color: '#8E44AD',
      archivedAt: null,
      notes: 'ZZP-er, factureert per kwartaal.',
      settings: { communicationTone: 'semi-formal', emailInstructions: '' },
      createdAt: new Date().toISOString(),
    },
  ]
}

if (!g._mockTasks) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString()
  const yesterday = new Date(Date.now() - 86400000).toISOString()

  g._mockTasks = [
    {
      id: 'task-1',
      clientId: 'client-1',
      title: 'Kwartaalrapport opstellen',
      description: 'Q2 2026 overzicht voor board meeting',
      status: 'in_progress',
      priority: 'high',
      dueDate: tomorrow,
      completedAt: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      clientId: 'client-1',
      title: 'Vluchten boeken naar Barcelona',
      description: null,
      status: 'todo',
      priority: 'normal',
      dueDate: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      clientId: 'client-2',
      title: 'Offerte nakijken',
      description: 'Nieuwe klant van Mark',
      status: 'waiting',
      priority: 'urgent',
      dueDate: yesterday,
      completedAt: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      clientId: 'client-2',
      title: 'LinkedIn post reviewen',
      description: null,
      status: 'done',
      priority: 'low',
      dueDate: null,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      clientId: 'client-3',
      title: 'Factuur augustus versturen',
      description: null,
      status: 'todo',
      priority: 'high',
      dueDate: tomorrow,
      completedAt: null,
      createdAt: new Date().toISOString(),
    },
  ]
}

export const mockDb = {
  clients: {
    findAll(): MockClient[] {
      return g._mockClients!
    },
    findById(id: string): MockClient | undefined {
      return g._mockClients!.find(c => c.id === id)
    },
    create(data: Omit<MockClient, 'id' | 'createdAt'>): MockClient {
      const client: MockClient = {
        ...data,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      g._mockClients!.push(client)
      return client
    },
    update(id: string, data: Partial<MockClient>): MockClient | null {
      const idx = g._mockClients!.findIndex(c => c.id === id)
      if (idx === -1) return null
      g._mockClients![idx] = { ...g._mockClients![idx], ...data }
      return g._mockClients![idx]
    },
    archive(id: string): void {
      const idx = g._mockClients!.findIndex(c => c.id === id)
      if (idx !== -1) g._mockClients![idx].archivedAt = new Date().toISOString()
    },
  },
  tasks: {
    findAll(clientId?: string, status?: string): (MockTask & { client: { id: string; name: string; color: string } })[] {
      let list = g._mockTasks!
      if (clientId) list = list.filter(t => t.clientId === clientId)
      if (status) list = list.filter(t => t.status === status)
      return list.map(t => ({
        ...t,
        client: ((): { id: string; name: string; color: string } => {
          const c = g._mockClients!.find(c => c.id === t.clientId)
          return { id: t.clientId, name: c?.name ?? 'Onbekend', color: c?.color ?? '#7F8C8D' }
        })(),
      }))
    },
    create(data: Omit<MockTask, 'id' | 'createdAt' | 'completedAt'>): MockTask & { client: { id: string; name: string; color: string } } {
      const task: MockTask = {
        ...data,
        id: `task-${Date.now()}`,
        completedAt: null,
        createdAt: new Date().toISOString(),
      }
      g._mockTasks!.push(task)
      const c = g._mockClients!.find(c => c.id === task.clientId)
      return { ...task, client: { id: task.clientId, name: c?.name ?? 'Onbekend', color: c?.color ?? '#7F8C8D' } }
    },
    update(id: string, data: Partial<MockTask>): (MockTask & { client: { id: string; name: string; color: string } }) | null {
      const idx = g._mockTasks!.findIndex(t => t.id === id)
      if (idx === -1) return null
      g._mockTasks![idx] = { ...g._mockTasks![idx], ...data }
      const t = g._mockTasks![idx]
      const c = g._mockClients!.find(c => c.id === t.clientId)
      return { ...t, client: { id: t.clientId, name: c?.name ?? 'Onbekend', color: c?.color ?? '#7F8C8D' } }
    },
    delete(id: string): void {
      g._mockTasks = g._mockTasks!.filter(t => t.id !== id)
    },
  },
}
