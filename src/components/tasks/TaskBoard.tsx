'use client'

import { useEffect, useState } from 'react'
import { Plus, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  client: { id: string; name: string; color: string }
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', accent: '#6B6560' },
  { id: 'in_progress', label: 'Bezig', accent: '#C4622D' },
  { id: 'waiting', label: 'Wachten op', accent: '#1B4F72' },
  { id: 'done', label: 'Klaar', accent: '#1A3A2A' },
]

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#C0392B',
  high: '#C4622D',
  normal: '#6B6560',
  low: '#A09890',
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const { activeClientId, clients } = useSidebarStore(s => ({
    activeClientId: s.activeClientId,
    clients: s.clients,
  }))

  const loadTasks = async () => {
    const url = activeClientId ? `/api/tasks?clientId=${activeClientId}` : '/api/tasks'
    const res = await fetch(url)
    if (res.ok) setTasks(await res.json())
    setLoading(false)
  }

  useEffect(() => { loadTasks() }, [activeClientId]) // eslint-disable-line

  const updateTaskStatus = async (taskId: string, status: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const createTask = async (status: string) => {
    if (!newTaskTitle.trim()) return
    const clientId = activeClientId || clients[0]?.id
    if (!clientId) { alert('Selecteer eerst een klant'); return }
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, title: newTaskTitle, status }),
    })
    if (res.ok) {
      const task = await res.json()
      setTasks(prev => [...prev, task])
    }
    setNewTaskTitle('')
    setAddingToColumn(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#D6CFBF', animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4 min-h-[400px]">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id)
        return (
          <div key={col.id} className="flex flex-col gap-2">
            {/* Column header */}
            <div className="flex items-center justify-between px-0.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.accent }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B6560' }}>
                  {col.label}
                </span>
                <span className="text-xs font-mono" style={{ color: '#A09890' }}>{colTasks.length}</span>
              </div>
              <button
                onClick={() => { setAddingToColumn(col.id); setNewTaskTitle('') }}
                className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-black/5"
                style={{ color: '#A09890' }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2">
              {colTasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={updateTaskStatus} />
              ))}

              {/* Inline add */}
              {addingToColumn === col.id && (
                <div
                  className="rounded-xl p-3"
                  style={{ background: '#FFFFFF', border: '1.5px solid #1A3A2A' }}
                >
                  <input
                    autoFocus
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') createTask(col.id)
                      if (e.key === 'Escape') setAddingToColumn(null)
                    }}
                    placeholder="Taaktitel..."
                    className="w-full text-sm outline-none bg-transparent"
                    style={{ color: '#0F0E0C' }}
                  />
                  <div className="flex gap-2 mt-2.5">
                    <button
                      onClick={() => createTask(col.id)}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
                      style={{ background: '#1A3A2A', color: '#F5F0E8' }}
                    >
                      Toevoegen
                    </button>
                    <button
                      onClick={() => setAddingToColumn(null)}
                      className="text-xs transition-colors"
                      style={{ color: '#A09890' }}
                    >
                      Annuleer
                    </button>
                  </div>
                </div>
              )}

              {/* Empty drop zone */}
              {colTasks.length === 0 && addingToColumn !== col.id && (
                <button
                  onClick={() => { setAddingToColumn(col.id); setNewTaskTitle('') }}
                  className="border-2 border-dashed rounded-xl flex items-center justify-center min-h-[80px] transition-colors hover:border-[#D6CFBF]"
                  style={{ borderColor: '#EDE8DC' }}
                >
                  <span className="text-xs" style={{ color: '#D6CFBF' }}>+ Taak</span>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: string) => void }) {
  const isDone = task.status === 'done'
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone

  return (
    <div
      className="rounded-xl p-3 transition-all group cursor-default"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E0D9CE',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        opacity: isDone ? 0.6 : 1,
      }}
    >
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onStatusChange(task.id, isDone ? 'todo' : 'done')}
          className="mt-0.5 flex-shrink-0 transition-colors"
          style={{ color: isDone ? '#1A3A2A' : '#D6CFBF' }}
        >
          {isDone
            ? <CheckCircle2 className="w-4 h-4" />
            : <Circle className="w-4 h-4" />
          }
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm leading-snug', isDone && 'line-through')} style={{ color: isDone ? '#A09890' : '#0F0E0C' }}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#A09890' }}>{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px]" style={{ color: '#A09890' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.client.color }} />
              {task.client.name}
            </span>

            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                color: PRIORITY_COLORS[task.priority],
                background: PRIORITY_COLORS[task.priority] + '18',
              }}
            >
              {task.priority}
            </span>

            {task.dueDate && (
              <span className={cn('flex items-center gap-0.5 text-[10px]')}
                style={{ color: isOverdue ? '#C0392B' : '#A09890' }}>
                {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {new Date(task.dueDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Move buttons on hover */}
      <div className="hidden group-hover:flex gap-1 mt-2 pt-2" style={{ borderTop: '1px solid #F0EDE8' }}>
        {COLUMNS.filter(c => c.id !== task.status).map(col => (
          <button
            key={col.id}
            onClick={() => onStatusChange(task.id, col.id)}
            className="text-[10px] px-1.5 py-0.5 rounded transition-colors hover:bg-[#F5F0E8]"
            style={{ color: '#A09890' }}
          >
            → {col.label}
          </button>
        ))}
      </div>
    </div>
  )
}
