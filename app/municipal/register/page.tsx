import type { Metadata } from 'next'
import { CastleScene } from '@/components/mario/scenes'
import { Castle } from '@/components/mario/sprites'
import { AuthCard } from '@/components/portal/auth-card'
import { WARDS } from '@/lib/data'

export const metadata: Metadata = { title: 'Municipal Registration | City Guardian' }

export default function MunicipalRegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 text-white">
      <CastleScene />
      <AuthCard
        mode="register"
        world="1-1"
        title="Join the Castle"
        subtitle="Register a ward officer account. Super Admin approval required."
        cardClass="bg-night-2 text-white border-[#3a4478]"
        buttonVariant="yellow"
        redirectTo="/municipal/dashboard"
        switchHref="/municipal/login"
        art={<Castle size={8} />}
        fields={[
          { name: 'name', label: 'Full name', placeholder: 'Rakesh Tiwari' },
          { name: 'email', label: 'Official email', type: 'email', placeholder: 'officer@imc.gov.in' },
          { name: 'ward', label: 'Ward', options: WARDS.map((w) => `${w.official} - ${w.area}`) },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
      />
    </main>
  )
}
