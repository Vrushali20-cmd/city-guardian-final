import type { Metadata } from 'next'
import { SkyScene } from '@/components/mario/scenes'
import { AuthCard } from '@/components/portal/auth-card'
import { Building2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Partner Registration | City Guardian' }

export default function PartnerRegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 text-ink">
      <SkyScene withGround />
      <AuthCard
        mode="register"
        world="1-3"
        title="Register Partner Guild"
        subtitle="Join Indore's gamified civic reward ecosystem as a Cafe, Brand or CSR Partner."
        buttonVariant="orange"
        redirectTo="/partner/dashboard"
        switchHref="/partner/login"
        art={
          <div className="grid size-16 place-items-center border-[3px] border-ink bg-pipe text-white shadow-[3px_3px_0_0_#14101f]">
            <Building2 className="size-8" />
          </div>
        }
        fields={[
          { name: 'businessName', label: 'Business / Organization Name', placeholder: 'Chhappan Brew Co.' },
          { name: 'type', label: 'Partner Category', options: ['Cafe', 'Restaurant', 'Retail', 'CSR Foundation', 'Corporate Sponsor'] },
          { name: 'email', label: 'Business Email', type: 'email', placeholder: 'partner@domain.com' },
          { name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
          { name: 'password', label: 'Set Password', type: 'password' },
        ]}
      />
    </main>
  )
}

