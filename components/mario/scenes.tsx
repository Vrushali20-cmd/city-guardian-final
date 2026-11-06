import { cn } from '@/lib/utils'

export function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden className={cn('absolute', className)} style={style}>
      <div className="relative h-10 w-28">
        <div className="absolute bottom-0 h-7 w-28 rounded-full bg-white" />
        <div className="absolute bottom-3 left-5 h-10 w-12 rounded-full bg-white" />
        <div className="absolute bottom-2 left-14 h-8 w-10 rounded-full bg-white" />
      </div>
    </div>
  )
}

export function Pipe({ className, height = 80 }: { className?: string; height?: number }) {
  return (
    <div aria-hidden className={cn('flex flex-col items-center', className)}>
      <div className="h-5 w-20 border-[3px] border-ink bg-pipe shadow-[inset_6px_0_0_#6ee08f,inset_-6px_0_0_#1b6e31]" />
      <div
        className="w-16 border-x-[3px] border-ink bg-pipe shadow-[inset_6px_0_0_#6ee08f,inset_-6px_0_0_#1b6e31]"
        style={{ height }}
      />
    </div>
  )
}

export function Hill({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('absolute rounded-t-full border-[3px] border-b-0 border-ink bg-pipe', className)}
    />
  )
}

const CLOUDS = [
  { top: '8%', dur: 70, delay: -10, scale: 1 },
  { top: '18%', dur: 95, delay: -50, scale: 0.7 },
  { top: '30%', dur: 80, delay: -30, scale: 0.85 },
  { top: '12%', dur: 110, delay: -80, scale: 1.2 },
  { top: '42%', dur: 120, delay: -5, scale: 0.6 },
]

/** Day overworld: drifting clouds over sky gradient. Used on landing + citizen portal. */
export function SkyScene({ withGround = false }: { withGround?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky to-sky-light">
      {CLOUDS.map((c, i) => (
        <Cloud
          key={i}
          className="animate-drift left-0"
          style={{ top: c.top, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, scale: String(c.scale) }}
        />
      ))}
      {withGround && <div className="checker-ground absolute inset-x-0 bottom-0 h-6 border-t-[3px] border-ink" />}
    </div>
  )
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 70}%`,
  delay: `${(i % 7) * 0.4}s`,
  size: i % 3 === 0 ? 3 : 2,
}))

/** Daylight Clash & Mario Fortress: sun, blue sky, clouds and fortress battlements. Used on municipal portal in light theme. */
export function CastleScene() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#dcfce7]">
      <div className="absolute right-[12%] top-[8%] size-20 rounded-full bg-[#fde047] shadow-[0_0_50px_15px_rgba(250,204,21,0.45)]" />
      {CLOUDS.map((c, i) => (
        <Cloud
          key={i}
          className="animate-drift left-0 opacity-80"
          style={{ top: c.top, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, scale: String(c.scale) }}
        />
      ))}
      <div className="checker-ground absolute inset-x-0 bottom-0 h-6 border-t-[3px] border-ink" />
    </div>
  )
}

/** Sunset kingdom: warm gradient, sun and dunes. Used on partner portal. */
export function SunsetScene() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-royal via-[#c2417a] to-sunset">
      <div className="absolute left-1/2 top-[55%] size-72 -translate-x-1/2 rounded-full bg-coin/70 blur-[2px]" />
      {CLOUDS.slice(0, 3).map((c, i) => (
        <Cloud
          key={i}
          className="animate-drift left-0 opacity-40"
          style={{ top: c.top, animationDuration: `${c.dur + 40}s`, animationDelay: `${c.delay}s` }}
        />
      ))}
      <div className="absolute -bottom-24 -left-20 h-64 w-[60%] rounded-t-full bg-[#f1b565]" />
      <div className="absolute -bottom-28 -right-20 h-72 w-[65%] rounded-t-full bg-[#e8a050]" />
    </div>
  )
}
