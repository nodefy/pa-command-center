import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SidebarStoreProvider } from '@/providers/sidebar-store-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PA Command Center',
  description: 'AI-powered cockpit voor professionele Personal Assistants',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} style={{ background: '#F5F0E8', color: '#0F0E0C' }}>
        <SidebarStoreProvider>
          {children}
        </SidebarStoreProvider>
      </body>
    </html>
  )
}
