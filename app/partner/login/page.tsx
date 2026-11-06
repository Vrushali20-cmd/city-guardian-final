import type { Metadata } from 'next'
import { SkyScene } from '@/components/mario/scenes'
import { AuthCard } from '@/components/portal/auth-card'
import { Coffee } from 'lucide-react'

export const metadata: Metadata = { title: 'Partner & CSR Login | City Guardian' }

export default function PartnerLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 text-ink">
      <SkyScene withGround />
      <AuthCard
        mode="login"
        world="1-3"
        title="Partner & CSR Guild"
        subtitle="Offer reward coupons, sponsor city cleanliness drives, and verify citizen vouchers."
        buttonVariant="orange"
        redirectTo="/partner/dashboard"
        switchHref="/partner/register"
        art={
          <div className="grid size-16 place-items-center border-[3px] border-ink bg-coin shadow-[3px_3px_0_0_#14101f]">
            <Coffee className="size-8 text-ink" />
          </div>
        }
        fields={[
          { name: 'email', label: 'Partner Business Email', type: 'email', placeholder: 'cafe@chhappan.in' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
      />
    </main>
  )
}

