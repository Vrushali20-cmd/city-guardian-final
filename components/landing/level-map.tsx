'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { LIFECYCLE } from '@/lib/data'
import { GuardianHero } from '@/components/mario/sprites'

const DESCRIPTIONS = [
  'Citizen snaps a photo with GPS & ward.',
  'AI detects category, severity and fix plan.',
  'Ward officer verifies the complaint.',
  'Mission assigned with a countdown timer.',
  'Crew on site, progress logged live.',
  'Ward uploads after-fix proof photo.',
  'Inspector compares before vs after.',
  'Reporter confirms the fix is real.',
  'Coins awarded to ward & citizen.',
]

export function LevelMap() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => setStep((s) => (s + 1) % LIFECYCLE.length), 1400)
    return () => clearInterval(id)
  }, [visible])

  const pct = (step / (LIFECYCLE.length - 1)) * 100

  return (
    <section id="how-it-works" ref={ref} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24">
      <h2 className="pixel-text-shadow text-center font-pixel text-xl text-white md:text-2xl">The level map</h2>
      <p className="mt-3 text-center text-sm font-semibold text-white [text-shadow:1px_1px_0_#14101f]">
        Every complaint is a 9-stage level. Watch the guardian clear it.
      </p>

      <div className="pixel-box relative mt-12 overflow-x-auto bg-cream p-6">
        <div className="relative min-w-[760px] pb-4 pt-16">
          <div className="absolute left-[5.55%] right-[5.55%] top-[80px] h-2 border-2 border-ink bg-sand" />
          <div
            className="absolute left-[5.55%] top-[80px] h-2 border-2 border-ink bg-pipe transition-all duration-700"
            style={{ width: `${(pct / 100) * 88.9}%` }}
          />
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-700 ease-out"
            style={{ left: `${((step + 0.5) / LIFECYCLE.length) * 100}%` }}
          >
            <GuardianHero size={4} className="animate-walk" />
          </div>
          <ol className="relative grid grid-cols-9 gap-2">
            {LIFECYCLE.map((s, i) => (
              <li key={s.key} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={i === step ? 'step' : undefined}
                  className={cn(
                    'grid size-10 place-items-center border-[3px] border-ink font-pixel text-[10px] transition-colors',
                    i < step ? 'bg-pipe text-white' : i === step ? 'bg-coin text-ink' : 'bg-white text-ink',
                  )}
                >
                  {i + 1}
                </button>
                <span className="mt-3 font-pixel text-[7px] uppercase leading-relaxed">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 border-t-[3px] border-dashed border-ink pt-4 text-center">
          <span className="font-pixel text-[9px] uppercase text-mario">Stage {step + 1}</span>
          <p className="mt-2 text-sm font-semibold">{DESCRIPTIONS[step]}</p>
        </div>
      </div>
    </section>
  )
}
