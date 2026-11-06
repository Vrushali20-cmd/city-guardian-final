import type { Metadata } from 'next'
import { CastleScene } from '@/components/mario/scenes'
import { PortalNav } from '@/components/portal/portal-nav'

export const metadata: Metadata = {
  title: 'Command Castle | Nagar Nigam - City Guardian',
}

const LINKS = [
  { href: '/municipal/dashboard', label: 'Dashboard' },
  { href: '/municipal/complaints', label: 'Complaints' },
  { href: '/municipal/missions', label: 'Missions' },
  { href: '/municipal/wards', label: 'Ward League' },
  { href: '/municipal/inspections', label: 'Inspections' },
  { href: '/municipal/partners', label: 'Partners' },
  { href: '/municipal/coupons', label: 'Coupons' },
  { href: '/municipal/events', label: 'Events' },
  { href: '/municipal/weather', label: 'AQI & Weather' },
  { href: '/municipal/analytics', label: 'Analytics' },
]

export default function MunicipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-ink">
      <CastleScene />
      <PortalNav
        title="Command Castle"
        badge="NN"
        world="1-1"
        coins={7110}
        links={LINKS}
        loginHref="/municipal/login"
        theme={{
          bar: 'bg-amber-400',
          brand: 'text-ink font-pixel text-shadow-none',
          badge: 'bg-ink text-coin',
          link: 'text-ink font-semibold hover:bg-amber-300/80',
          active: 'bg-white text-ink border-ink shadow-[2px_2px_0_0_#14101f]',
          hudTone: 'light',
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
