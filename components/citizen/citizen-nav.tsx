'use client'

import { PortalNav, type NavLink } from '@/components/portal/portal-nav'
import { PlayerSwitcher } from '@/components/citizen/player-switcher'
import { useCityGuardian } from '@/lib/storage'

export function CitizenNav({ links }: { links: NavLink[] }) {
  const { citizen } = useCityGuardian()

  return (
    <PortalNav
      title="Raipur Guardians"
      badge="CG"
      world="1-2"
      coins={citizen.points}
      links={links}
      loginHref="/citizen/login"
      extra={<PlayerSwitcher />}
      theme={{
        bar: 'bg-amber-400',
        brand: 'text-ink font-pixel font-bold',
        badge: 'bg-mario text-white',
        link: 'text-ink font-semibold hover:bg-amber-300',
        active: 'bg-white text-ink border-ink shadow-[2px_2px_0_0_#14101f]',
        hudTone: 'light',
      }}
    />
  )
}
