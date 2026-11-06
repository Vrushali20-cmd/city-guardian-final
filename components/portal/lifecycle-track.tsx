import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LIFECYCLE, type Status } from '@/lib/data'

export function LifecycleTrack({ status, dark = false }: { status: Status; dark?: boolean }) {
  const idx = LIFECYCLE.findIndex((s) => s.key === status)
  const current = idx === -1 ? 4 : idx
  const blocked = idx === -1
  return (
    <ol className="flex flex-col gap-0">
      {LIFECYCLE.map((s, i) => {
        const done = i < current || (i === current && s.key === 'rewarded')
        const active = i === current && !done
        return (
          <li key={s.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'grid size-7 place-items-center border-[3px] border-ink font-pixel text-[8px]',
                  done ? 'bg-pipe text-white' : active ? (blocked ? 'bg-mario text-white' : 'bg-coin text-ink') : 'bg-white text-ink',
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
              </span>
              {i < LIFECYCLE.length - 1 && <span className={cn('h-5 w-[3px]', done ? 'bg-pipe' : dark ? 'bg-white/30' : 'bg-ink/20')} />}
            </div>
            <span className={cn('pt-1 text-sm', active ? 'font-bold' : done ? '' : 'opacity-60')}>
              {s.label}
              {active && blocked && <span className="ml-2 font-pixel text-[8px] uppercase text-mario">Blocked</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
