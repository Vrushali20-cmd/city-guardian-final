import type { Metadata } from 'next'
import { SkyScene } from '@/components/mario/scenes'
import { GuardianHero } from '@/components/mario/sprites'
import { AuthCard } from '@/components/portal/auth-card'
import { WARDS } from '@/lib/data'

export const metadata: Metadata = { title: 'Join as Citizen | City Guardian' }

export default function CitizenRegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 text-ink">
      <SkyScene withGround />
      <AuthCard
        mode="register"
        world="1-2"
        title="New player"
        subtitle="Create your Guardian profile and pick your home ward."
        buttonVariant="red"
        redirectTo="/citizen/dashboard"
        switchHref="/citizen/login"
        art={<GuardianHero size={6} className="animate-hop" />}
        fields={[
          { name: 'name', label: 'Full name', placeholder: 'Aarav Sharma' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98xxxxxx' },
          { name: 'ward', label: 'Home ward', options: WARDS.map((w) => `${w.official} - ${w.game}`) },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
      />
    </main>
  )
}
