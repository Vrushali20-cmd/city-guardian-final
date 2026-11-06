'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Coin, PixelLink, QBlock } from '@/components/mario/pixel-ui'
import { Mushroom } from '@/components/mario/sprites'

const TAGLINE = 'Gamifying civic accountability, not administrative authority.'

function useTyped(text: string, speed = 35) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) return
    const t = setTimeout(() => setN((v) => v + 1), speed)
    return () => clearTimeout(t)
  }, [n, text, speed])
  return text.slice(0, n)
}

function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return v
}

export function Hero() {
  const typed = useTyped(TAGLINE)
  const coins = useCountUp(1250)
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-14 lg:grid-cols-2">
      <div>
        <div className="flex gap-3">
          <QBlock />
          <QBlock label="$" />
          <QBlock />
        </div>
        <h1 className="pixel-text-shadow mt-8 font-pixel text-3xl leading-snug text-white md:text-5xl md:leading-tight">
          <span className="animate-drop-in block">Level up</span>
          <span className="animate-drop-in block [animation-delay:150ms]">
            your <span className="text-coin">city</span>
          </span>
        </h1>
        <p className="mt-4 min-h-5 font-pixel text-[9px] leading-relaxed text-ink" aria-label={TAGLINE}>
          {typed}
          <span className="animate-twinkle">_</span>
        </p>
        <div className="pixel-box mt-6 max-w-md bg-[#eef3ff] p-5 text-[15px] leading-relaxed">
          Report potholes, garbage and broken streetlights. Track every fix live, earn Guardian Coins, and redeem them
          at partner cafes. Nagar Nigam, citizens and CSR partners — one connected game.
        </div>
        <div className="mt-7 flex flex-wrap gap-4">
          <PixelLink href="#portals" variant="red">
            Start game
          </PixelLink>
          <PixelLink href="#how-it-works" variant="white">
            How to play
          </PixelLink>
        </div>
      </div>

      <div className="relative">
        <div className="pixel-box animate-float-y relative overflow-hidden bg-white p-2">
          <Image
            src="/images/hero-city.png"
            alt="Clean, tree-lined Indore boulevard at golden hour"
            width={1200}
            height={700}
            priority
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div className="pixel-box absolute -right-3 -top-5 flex items-center gap-2 bg-ink px-4 py-3 font-pixel text-[10px] text-coin">
          <Coin size={16} /> x {coins.toLocaleString('en-IN')}
        </div>
        <Mushroom size={4} className="absolute -bottom-5 -left-4 animate-float-y [animation-delay:600ms]" />
      </div>
    </section>
  )
}
