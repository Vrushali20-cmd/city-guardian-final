import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, Press_Start_2P } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start',
})

export const metadata: Metadata = {
  title: 'City Guardian | Level Up Your City',
  description:
    'AI-assisted civic accountability platform connecting Nagar Nigam ward teams, citizens and CSR partners. Report issues, track live missions, earn Guardian Coins.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#5c94fc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${pressStart.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'font-sans !border-[3px] !border-ink !rounded-none !shadow-[4px_4px_0_0_#14101f]',
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
