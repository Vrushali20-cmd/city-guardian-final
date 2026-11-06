import type { Metadata } from 'next'
import { SkyScene } from '@/components/mario/scenes'
import { PortalNav } from '@/components/portal/portal-nav'

export const metadata: Metadata = {
  title: 'Partner Kingdom | CSR & Merchants - City Guardian',
}

const LINKS = [
  { href: '/partner/dashboard', label: 'Dashboard' },
  { href: '/partner/coupons', label: 'My Coupons' },
  { href: '/partner/events', label: 'Sponsored Events' },
  { href: '/partner/impact', label: 'CSR Impact' },
]

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-ink">
      <SkyScene />
      <PortalNav
        title="Partner Kingdom"
        badge="CSR"
        world="1-3"
        coins={920}
        links={LINKS}
        loginHref="/partner/login"
        theme={{
          bar: 'bg-amber-400',
          brand: 'text-ink font-pixel font-bold',
          badge: 'bg-royal text-white',
          link: 'text-ink font-semibold hover:bg-amber-300',
          active: 'bg-white text-ink border-ink shadow-[2px_2px_0_0_#14101f]',
          hudTone: 'light',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

