import Link from 'next/link'
import { PixelLink } from '@/components/mario/pixel-ui'

const LINKS = [
  { href: '#portals', label: 'Portals' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#loops', label: 'Three loops' },
  { href: '#leaderboard', label: 'Leaderboard' },
]

export function SiteHeader() {
  return (
    <header className="brick-bg sticky top-0 z-40 border-b-[3px] border-ink">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center border-[3px] border-ink bg-coin font-pixel text-[10px] text-ink">
            CG
          </span>
          <span className="pixel-text-shadow font-pixel text-xs text-white sm:text-sm">City Guardian</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="pixel-text-shadow font-pixel text-[10px] uppercase text-white hover:text-coin"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <PixelLink href="/citizen/login" variant="yellow" className="px-4 py-2.5">
          Play now
        </PixelLink>
      </div>
    </header>
  )
}
