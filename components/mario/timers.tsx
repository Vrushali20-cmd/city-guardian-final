'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Coin } from './pixel-ui'

function useNow(interval = 1000) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown({ deadline, className }: { deadline: string; className?: string }) {
  const now = useNow()
  if (now === null) return <span className={cn('font-pixel text-[10px]', className)}>--:--:--:--</span>
  const diff = new Date(deadline).getTime() - now
  const overdue = diff <= 0
  const abs = Math.abs(diff)
  const d = Math.floor(abs / 86400000)
  const h = Math.floor((abs % 86400000) / 3600000)
  const m = Math.floor((abs % 3600000) / 60000)
  const s = Math.floor((abs % 60000) / 1000)
  return (
    <span
      role="timer"
      aria-label={overdue ? 'Overdue' : 'Time remaining'}
      className={cn(
        'inline-flex items-center gap-1 border-2 border-ink px-2 py-1 font-pixel text-[10px] tabular-nums',
        overdue ? 'animate-flash-red text-white' : diff < 86400000 ? 'bg-sunset text-ink' : 'bg-ink text-coin',
        className,
      )}
    >
      {overdue && <span>-</span>}
      {pad(d)}:{pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}

export function Hud({
  coins,
  world,
  className,
  tone = 'dark',
}: {
  coins: number
  world: string
  className?: string
  tone?: 'dark' | 'light'
}) {
  const now = useNow()
  const time = now ? new Date(now).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'
  return (
    <div
      className={cn(
        'flex items-center gap-4 font-pixel text-[9px] uppercase',
        tone === 'dark' ? 'text-white' : 'text-ink',
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <Coin size={12} /> x{String(coins).padStart(4, '0')}
      </span>
      <span className="hidden sm:inline">World {world}</span>
      <span className="hidden sm:inline">Time {time}</span>
    </div>
  )
}
