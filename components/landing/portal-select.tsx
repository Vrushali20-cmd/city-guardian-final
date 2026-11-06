'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Building2, Coffee, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Hill, Pipe } from '@/components/mario/scenes'
import { GuardianHero } from '@/components/mario/sprites'

const PORTALS = [
  {
    world: '1-1',
    title: 'Municipal Corporation',
    subtitle: 'Nagar Nigam Command Castle',
    href: '/municipal/login',
    image: '/images/pothole.png',
    alt: 'Water-filled pothole on a busy street',
    Icon: Building2,
    features: ['Verify & assign complaints', 'Ward missions with live timers', 'AQI + weather zone map', 'Approve partners & coupons'],
    card: 'bg-night text-white',
    sub: 'text-white/70',
    btn: 'bg-coin text-ink',
  },
  {
    world: '1-2',
    title: 'Public / Citizens',
    subtitle: 'Overworld Guardians',
    href: '/citizen/login',
    image: '/images/garbage.png',
    alt: 'Garbage pile at a street corner',
    Icon: Users,
    features: ['Report issues with AI analysis', 'Track the full fix lifecycle', 'Earn Guardian Coins & badges', 'Join drives & events'],
    card: 'bg-sky text-white',
    sub: 'text-white/80',
    btn: 'bg-mario text-white',
  },
  {
    world: '1-3',
    title: 'CSR, Restaurants & Cafes',
    subtitle: 'Sunset Partner Kingdom',
    href: '/partner/login',
    image: '/images/cafe.png',
    alt: 'Cozy cafe interior at sunset',
    Icon: Coffee,
    features: ['Create reward coupons', 'Verify citizen redeem codes', 'Climb the CSR rank', 'Host community events'],
    card: 'bg-royal text-white',
    sub: 'text-white/75',
    btn: 'bg-sunset text-ink',
  },
]

export function PortalSelect() {
  const router = useRouter()
  const [warping, setWarping] = useState<string | null>(null)

  const enter = (href: string) => {
    setWarping(href)
    router.prefetch(href)
    setTimeout(() => router.push(href), 900)
  }

  return (
    <section id="portals" className="relative scroll-mt-20 pt-10">
      <Hill className="-left-10 top-24 h-36 w-64" />
      <Hill className="right-0 top-6 h-52 w-96 hidden md:block" />
      <div className="absolute right-[10%] top-12 hidden md:block">
        <Pipe height={100} />
      </div>
      <div className="absolute left-[28%] top-28 hidden md:block">
        <Pipe height={40} />
      </div>
      <div className="relative">
        <h2 className="pixel-text-shadow text-center font-pixel text-xl text-white md:text-2xl">Select your world</h2>
        <p className="mt-3 text-center text-sm font-semibold text-white [text-shadow:1px_1px_0_#14101f]">
          Three independent portals. One connected city.
        </p>
      </div>

      <div className="relative mt-16">
        <div className="absolute inset-x-0 top-14 border-t-[3px] border-ink bg-pipe">
          <div className="checker-ground h-10 border-t-[3px] border-ink" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {PORTALS.map((p, i) => (
            <article
              key={p.world}
              className={cn('pixel-box animate-rise-in flex flex-col overflow-hidden transition-transform hover:-translate-y-2', p.card)}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative border-b-[3px] border-ink">
                <Image src={p.image} alt={p.alt} width={800} height={500} className="aspect-[2/1] w-full object-cover" />
                <span className="absolute left-3 top-3 bg-ink px-2 py-1 font-pixel text-[8px] text-coin">World {p.world}</span>
                <span className="absolute right-3 top-3 grid size-9 place-items-center border-[3px] border-ink bg-coin text-ink">
                  <p.Icon className="size-4" aria-hidden />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-pixel text-[11px] uppercase leading-relaxed">{p.title}</h3>
                <p className={cn('mt-1 text-sm', p.sub)}>{p.subtitle}</p>
                <ul className="mt-4 flex flex-col gap-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span aria-hidden className="size-2 shrink-0 bg-coin" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => enter(p.href)}
                  className={cn(
                    'pixel-press mt-6 flex items-center justify-center gap-2 border-[3px] border-ink py-3 font-pixel text-[11px] uppercase shadow-[4px_4px_0_0_#14101f]',
                    p.btn,
                  )}
                >
                  Enter <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {warping && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-50 grid place-items-center bg-ink/90 animate-in fade-in">
          <span className="sr-only">Entering portal</span>
          <div className="relative flex h-72 w-40 flex-col items-center justify-end overflow-hidden">
            <div className="warp-hero absolute top-6">
              <GuardianHero size={6} />
            </div>
            <div className="relative z-10">
              <Pipe height={110} />
            </div>
          </div>
          <style>{`.warp-hero{animation:warp-down .85s ease-in forwards}@keyframes warp-down{to{transform:translateY(170px)}}`}</style>
        </div>
      )}
    </section>
  )
}
