'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Hud } from '@/components/mario/timers'

export type NavLink = { href: string; label: string }

export type NavTheme = {
  bar: string
  brand: string
  badge: string
  link: string
  active: string
  hudTone: 'dark' | 'light'
}

export function PortalNav({
  title,
  badge,
  world,
  coins,
  links,
  theme,
  loginHref,
  extra,
}: {
  title: string
  badge: string
  world: string
  coins: number
  links: NavLink[]
  theme: NavTheme
  loginHref: string
  extra?: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    toast('Game saved. See you next level!')
    router.push(loginHref)
  }

  return (
    <header className={cn('sticky top-0 z-40 border-b-[3px] border-ink', theme.bar)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="City Guardian home">
          <span className={cn('grid size-8 place-items-center border-[3px] border-ink font-pixel text-[9px]', theme.badge)}>
            {badge}
          </span>
          <span className={cn('font-pixel text-[10px] uppercase sm:text-xs', theme.brand)}>{title}</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {extra}
          <Hud coins={coins} world={world} tone={theme.hudTone} />
          <button
            type="button"
            onClick={logout}
            className="grid size-8 place-items-center border-2 border-ink bg-white text-ink hover:bg-coin"
            aria-label="Log out"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <nav aria-label={`${title} navigation`} className="border-t-2 border-ink/40">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {links.map((l) => {
            const active = pathname === l.href || (l.href.split('/').length > 2 && pathname.startsWith(l.href + '/'))
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block border-2 px-3 py-1.5 font-pixel text-[8px] uppercase transition-colors',
                    active ? cn('border-ink', theme.active) : cn('border-transparent', theme.link),
                  )}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
