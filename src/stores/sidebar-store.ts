// Kept for backwards compatibility — actual state is in sidebar-store-provider.tsx
// No Zustand dependency needed in mock mode.

export type Client = {
  id: string
  name: string
  company: string | null
  color: string
  archivedAt: string | null
}

export type SidebarStore = {
  activeClientId: string | null
  clients: Client[]
  commandOpen: boolean
  setActiveClient: (clientId: string | null) => void
  setClients: (clients: Client[]) => void
  setCommandOpen: (open: boolean) => void
}
