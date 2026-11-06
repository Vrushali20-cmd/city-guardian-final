import Link from 'next/link'
import { SkyScene } from '@/components/mario/scenes'
import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { PortalSelect } from '@/components/landing/portal-select'
import { LevelMap } from '@/components/landing/level-map'
import { Leaderboards, ThreeLoops } from '@/components/landing/loops-and-boards'

export default function HomePage() {
  return (
    <>
      <SkyScene />
      <SiteHeader />
      <main>
        <Hero />
        <PortalSelect />
        <LevelMap />
        <ThreeLoops />
        <Leaderboards />
      </main>
      <footer className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <span className="font-pixel text-[10px] uppercase">City Guardian - Raipur</span>
          <nav aria-label="Portals" className="flex gap-6 text-sm">
            <Link href="/municipal/login" className="hover:text-coin">Municipal</Link>
            <Link href="/citizen/login" className="hover:text-coin">Citizens</Link>
            <Link href="/partner/login" className="hover:text-coin">Partners</Link>
          </nav>
          <span className="text-xs text-white/60">Made for cleaner, safer cities.</span>
        </div>
      </footer>
    </>
  )
}
