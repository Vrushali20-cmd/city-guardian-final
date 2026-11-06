'use client'

import Link from 'next/link'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { STATUS_LABEL, type Severity, type Status } from '@/lib/data'

export function Coin({ size = 16, spin = true, className }: { size?: number; spin?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block shrink-0 rounded-full border-2 border-coin-dark bg-coin', spin && 'animate-coin-spin', className)}
      style={{ width: size * 0.75, height: size, boxShadow: 'inset -2px -2px 0 #b7791f, inset 2px 2px 0 #fde68a' }}
    />
  )
}

export function QBlock({ label = '?', className }: { label?: string; className?: string }) {
  const [hits, setHits] = useState(0)
  return (
    <button
      type="button"
      aria-label="Bonus block"
      onClick={() => setHits((h) => h + 1)}
      onMouseEnter={() => setHits((h) => h + 1)}
      className={cn(
        'relative grid size-11 place-items-center border-[3px] border-ink bg-coin font-pixel text-sm text-ink shadow-[inset_-3px_-3px_0_#b7791f,inset_3px_3px_0_#fde68a]',
        className,
      )}
    >
      <span key={hits} className={cn('block', hits > 0 && 'animate-block-bump')}>
        {label}
      </span>
      {hits > 0 && (
        <span key={`c-${hits}`} className="coin-pop pointer-events-none">
          <Coin size={18} />
        </span>
      )}
    </button>
  )
}

const BTN_VARIANTS = {
  red: 'bg-mario text-white',
  yellow: 'bg-coin text-ink',
  green: 'bg-pipe text-white',
  white: 'bg-white text-ink',
  orange: 'bg-sunset text-ink',
  ink: 'bg-ink text-white',
  purple: 'bg-royal text-white',
}

type BtnVariant = keyof typeof BTN_VARIANTS

const btnBase =
  'pixel-press inline-flex items-center justify-center gap-2 border-[3px] border-ink px-5 py-3 font-pixel text-[11px] uppercase leading-none shadow-[4px_4px_0_0_#14101f] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coin disabled:pointer-events-none disabled:opacity-50'

export function PixelButton({
  variant = 'red',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: BtnVariant }) {
  return <button className={cn(btnBase, BTN_VARIANTS[variant], className)} {...props} />
}

export function PixelLink({
  variant = 'red',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant }) {
  return <Link className={cn(btnBase, BTN_VARIANTS[variant], className)} {...props} />
}

export function PixelCard({
  className,
  children,
  as: Tag = 'div',
}: {
  className?: string
  children: ReactNode
  as?: 'div' | 'section' | 'article'
}) {
  return <Tag className={cn('pixel-box bg-cream text-ink', className)}>{children}</Tag>
}

export function PixelHeading({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('font-pixel text-base leading-relaxed md:text-lg', className)}>{children}</h2>
}

const SEV: Record<Severity, string> = {
  Low: 'bg-pipe text-white',
  Medium: 'bg-coin text-ink',
  High: 'bg-sunset text-ink',
  Critical: 'bg-mario text-white',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn('inline-block border-2 border-ink px-2 py-1 font-pixel text-[8px] uppercase', SEV[severity])}>
      {severity}
    </span>
  )
}

const STATUS_COLOR: Partial<Record<Status, string>> = {
  reported: 'bg-white text-ink',
  ai_analyzed: 'bg-sky text-white',
  municipal_verified: 'bg-sky text-white',
  assigned: 'bg-coin text-ink',
  in_progress: 'bg-sunset text-ink',
  resolved: 'bg-pipe text-white',
  inspection_verified: 'bg-pipe text-white',
  citizen_verified: 'bg-pipe text-white',
  rewarded: 'bg-royal text-white',
  rejected: 'bg-ink text-white',
  disputed: 'bg-mario text-white',
  rework: 'bg-mario text-white',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-block border-2 border-ink px-2 py-1 font-pixel text-[8px] uppercase',
        STATUS_COLOR[status] ?? 'bg-white',
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

export function StatTile({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string
  value: ReactNode
  className?: string
  valueClassName?: string
}) {
  return (
    <div className={cn('pixel-box bg-ink p-5 text-center text-white', className)}>
      <div className={cn('font-pixel text-xl text-coin', valueClassName)}>{value}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider opacity-80">{label}</div>
    </div>
  )
}

export function PixelInput({ label, id, className, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="font-pixel text-[9px] uppercase">{label}</span>
      <input
        id={id}
        className={cn(
          'border-[3px] border-ink bg-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-3 focus-visible:ring-coin',
          className,
        )}
        {...props}
      />
    </label>
  )
}
