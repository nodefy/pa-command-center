import { TaskBoard } from '@/components/tasks/TaskBoard'

export default function TasksPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A09890' }}>Module</p>
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
          Taken
        </h1>
      </div>
      <TaskBoard />
    </div>
  )
}
