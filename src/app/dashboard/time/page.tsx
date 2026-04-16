'use client'

import { useState, useEffect } from 'react'
import { Play, Square, RotateCcw, Plus, Clock } from 'lucide-react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}u ${m}m` : `${h}u`
}

const today = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })

const mockEntries = [
  { id: '1', clientName: 'Sarah van den Berg', color: '#1B4F72', description: 'E-mails beantwoorden & inbox opruimen', minutes: 45, day: 'today' },
  { id: '2', clientName: 'Mark Janssen', color: '#27AE60', description: 'Vergadering voorbereiden Q2 review', minutes: 90, day: 'today' },
  { id: '3', clientName: 'Lisa de Vries', color: '#8E44AD', description: 'Research reisopties Berlijn', minutes: 30, day: 'yesterday' },
  { id: '4', clientName: 'Sarah van den Berg', color: '#1B4F72', description: 'Agenda bijwerken april', minutes: 20, day: 'yesterday' },
  { id: '5', clientName: 'Mark Janssen', color: '#27AE60', description: 'Contracten controleren & archiveren', minutes: 60, day: 'yesterday' },
]

export default function TimePage() {
  const {
    clients, activeClientId,
    timerRunning, timerSeconds, timerClientId,
    startTimer, stopTimer, resetTimer, setTimerClientId, setTimerDescription, timerDescription,
  } = useSidebarStore(s => ({
    clients: s.clients,
    activeClientId: s.activeClientId,
    timerRunning: s.timerRunning,
    timerSeconds: s.timerSeconds,
    timerClientId: s.timerClientId,
    timerDescription: s.timerDescription,
    startTimer: s.startTimer,
    stopTimer: s.stopTimer,
    resetTimer: s.resetTimer,
    setTimerClientId: s.setTimerClientId,
    setTimerDescription: s.setTimerDescription,
  }))

  const activeClients = clients.filter(c => !c.archivedAt)
  const timerClient = clients.find(c => c.id === timerClientId)

  const todayEntries = mockEntries.filter(e => e.day === 'today')
  const yesterdayEntries = mockEntries.filter(e => e.day === 'yesterday')
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.minutes, 0)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A09890' }}>
          Urenregistratie
        </p>
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}>
          Tijd bijhouden
        </h1>
      </div>

      {/* Timer card */}
      <div
        className="rounded-2xl p-6 mb-6 transition-all duration-500"
        style={{
          background: timerRunning ? '#1A3A2A' : '#FFFFFF',
          border: timerRunning ? 'none' : '1px solid #E0D9CE',
          boxShadow: timerRunning
            ? '0 4px 24px rgba(26, 58, 42, 0.3)'
            : '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Client selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {activeClients.map(client => {
            const isSelected = timerClientId === client.id
            return (
              <button
                key={client.id}
                onClick={() => setTimerClientId(client.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: isSelected
                    ? client.color + '25'
                    : timerRunning ? 'rgba(255,255,255,0.08)' : '#F5F0E8',
                  color: isSelected
                    ? client.color
                    : timerRunning ? 'rgba(255,255,255,0.5)' : '#6B6560',
                  border: isSelected
                    ? `1.5px solid ${client.color}50`
                    : timerRunning ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid #E0D9CE',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? client.color : 'currentColor', opacity: isSelected ? 1 : 0.5 }} />
                {client.name}
              </button>
            )
          })}
        </div>

        {/* Description input */}
        <input
          value={timerDescription}
          onChange={e => setTimerDescription(e.target.value)}
          placeholder="Wat ben je aan het doen..."
          className="w-full text-sm bg-transparent outline-none mb-5 placeholder:opacity-40"
          style={{ color: timerRunning ? '#FFFFFF' : '#0F0E0C' }}
        />

        {/* Time display */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-5xl font-mono font-semibold tracking-wider tabular-nums"
              style={{ color: timerRunning ? '#FFFFFF' : '#0F0E0C' }}
            >
              {formatTime(timerSeconds)}
            </span>
            {timerClient && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: timerRunning ? '#4ADE80' : timerClient.color }}>
                {timerClient.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {timerSeconds > 0 && !timerRunning && (
              <button
                onClick={resetTimer}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: '#F5F0E8', color: '#A09890' }}
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => timerRunning ? stopTimer() : startTimer(timerClientId ?? undefined)}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg"
              style={{
                background: timerRunning ? '#DC2626' : '#F5F0E8',
                color: timerRunning ? '#FFFFFF' : '#1A3A2A',
                boxShadow: timerRunning
                  ? '0 0 0 4px rgba(220,38,38,0.2)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {timerRunning
                ? <Square className="w-5 h-5" />
                : <Play className="w-5 h-5 ml-0.5" />
              }
            </button>

            {timerSeconds > 0 && (
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all text-xs font-semibold"
                style={{
                  background: timerRunning ? 'rgba(255,255,255,0.15)' : '#1A3A2A',
                  color: timerRunning ? '#FFFFFF' : '#F5F0E8',
                }}
                title="Opslaan"
                onClick={() => { stopTimer(); resetTimer() }}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Today total */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold capitalize" style={{ color: '#0F0E0C' }}>
          {today}
        </p>
        <span className="text-sm font-mono font-medium" style={{ color: '#1A3A2A' }}>
          {formatMinutes(todayTotal)} totaal
        </span>
      </div>

      {/* Today entries */}
      {todayEntries.length === 0 ? (
        <div className="rounded-xl p-8 text-center mb-6" style={{ background: '#FFFFFF', border: '1px solid #E0D9CE' }}>
          <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: '#D6CFBF' }} />
          <p className="text-sm" style={{ color: '#A09890' }}>Nog geen uren vandaag</p>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {todayEntries.map(entry => (
            <div
              key={entry.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#FFFFFF', border: '1px solid #E0D9CE' }}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#0F0E0C' }}>{entry.description}</p>
                <p className="text-xs mt-0.5" style={{ color: '#A09890' }}>{entry.clientName}</p>
              </div>
              <span className="text-sm font-mono font-medium tabular-nums flex-shrink-0" style={{ color: '#6B6560' }}>
                {formatMinutes(entry.minutes)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Yesterday */}
      <p className="text-sm font-semibold capitalize mb-4" style={{ color: '#6B6560' }}>
        {yesterday}
      </p>
      <div className="space-y-2">
        {yesterdayEntries.map(entry => (
          <div
            key={entry.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-70"
            style={{ background: '#FFFFFF', border: '1px solid #E0D9CE' }}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#0F0E0C' }}>{entry.description}</p>
              <p className="text-xs mt-0.5" style={{ color: '#A09890' }}>{entry.clientName}</p>
            </div>
            <span className="text-sm font-mono font-medium tabular-nums flex-shrink-0" style={{ color: '#6B6560' }}>
              {formatMinutes(entry.minutes)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
