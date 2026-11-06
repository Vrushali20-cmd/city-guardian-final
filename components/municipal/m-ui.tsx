import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function MPanel({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}) {
  return (
    <section className={cn('pixel-box bg-white text-ink overflow-hidden', className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-amber-100/80 px-5 py-3">
          <h2 className="font-pixel text-[10px] uppercase text-ink">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function MPageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-outline font-pixel text-lg uppercase leading-relaxed text-white md:text-xl">{title}</h1>
        <p className="mt-2 inline-block border-2 border-ink bg-white/95 px-2.5 py-1 text-sm font-semibold text-ink shadow-[2px_2px_0_0_#14101f]">
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  )
}

export function MStat({
  label,
  value,
  tone = 'coin',
}: {
  label: string
  value: ReactNode
  tone?: 'coin' | 'red' | 'green' | 'sky'
}) {
  const color = {
    coin: 'text-amber-700',
    red: 'text-mario',
    green: 'text-pipe-dark',
    sky: 'text-blue-700',
  }[tone]
  return (
    <div className="pixel-box-sm bg-amber-50/90 p-4 text-center">
      <div className={cn('font-pixel text-lg', color)}>{value}</div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-ink/75">{label}</div>
    </div>
  )
}

export const mBtn =
  'pixel-press inline-flex items-center justify-center gap-1.5 border-2 border-ink px-3 py-2 font-pixel text-[8px] uppercase shadow-[2px_2px_0_0_#14101f] disabled:opacity-40'
