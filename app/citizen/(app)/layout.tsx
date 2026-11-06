import type { Metadata } from 'next'
import { SkyScene } from '@/components/mario/scenes'
import { CitizenNav } from '@/components/citizen/citizen-nav'

export const metadata: Metadata = { title: 'Overworld | Citizens - City Guardian' }

const LINKS = [
  { href: '/citizen/dashboard', label: 'Home' },
  { href: '/citizen/report', label: 'Report issue' },
  { href: '/citizen/complaints', label: 'My reports' },
  { href: '/citizen/rewards', label: 'Coin shop' },
  { href: '/citizen/leaderboard', label: 'Leaderboard' },
  { href: '/citizen/events', label: 'Events' },
  { href: '/citizen/profile', label: 'Profile' },
]

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-ink">
      <SkyScene />
      <CitizenNav links={LINKS} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
