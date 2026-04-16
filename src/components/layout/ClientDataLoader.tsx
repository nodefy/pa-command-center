'use client'

import { useEffect } from 'react'
import { useSidebarStore } from '@/providers/sidebar-store-provider'

// This component fetches clients and syncs them into Zustand
export function ClientDataLoader() {
  const setClients = useSidebarStore(s => s.setClients)

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setClients(data)
      })
      .catch(console.error)
  }, [setClients])

  return null
}
