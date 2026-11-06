import type { Metadata } from 'next'
import { SkyScene } from '@/components/mario/scenes'
import { GuardianHero } from '@/components/mario/sprites'
import { AuthCard } from '@/components/portal/auth-card'

export const metadata: Metadata = { title: 'Citizen Login | City Guardian' }

export default function CitizenLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 text-ink">
      <SkyScene withGround />
      <AuthCard
        mode="login"
        world="1-2"
        title="Player 1 start"
        subtitle="Report issues, track fixes and earn Guardian Coins."
        buttonVariant="red"
        redirectTo="/citizen/dashboard"
        switchHref="/citizen/register"
        art={<GuardianHero size={6} className="animate-hop" />}
        fields={[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
      />
    </main>
  )
}
