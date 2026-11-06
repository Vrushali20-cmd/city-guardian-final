import type { Metadata } from 'next'
import { CastleScene } from '@/components/mario/scenes'
import { Castle } from '@/components/mario/sprites'
import { AuthCard } from '@/components/portal/auth-card'

export const metadata: Metadata = { title: 'Municipal Login | City Guardian' }

export default function MunicipalLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 text-white">
      <CastleScene />
      <AuthCard
        mode="login"
        world="1-1"
        title="Command Castle"
        subtitle="Nagar Nigam ward officers & inspectors sign in here."
        cardClass="bg-night-2 text-white border-[#3a4478]"
        buttonVariant="yellow"
        redirectTo="/municipal/dashboard"
        switchHref="/municipal/register"
        art={<Castle size={8} />}
        fields={[
          { name: 'email', label: 'Official email', type: 'email', placeholder: 'officer@imc.gov.in' },
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'role', label: 'Role', options: ['Ward Officer', 'Inspector', 'Super Admin'] },
        ]}
      />
    </main>
  )
}
