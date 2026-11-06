import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Complaint } from '@/lib/data'
import { SeverityBadge, StatusBadge } from '@/components/mario/pixel-ui'

export function CPageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-outline font-pixel text-lg uppercase leading-relaxed text-white md:text-xl">{title}</h1>
        <p className="mt-2 inline-block bg-white/90 px-2 py-1 text-sm font-semibold">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}

export function CCard({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <section className={cn('pixel-box bg-white p-5', className)}>
      {title && <h2 className="mb-4 font-pixel text-[10px] uppercase">{title}</h2>}
      {children}
    </section>
  )
}

export function ComplaintTile({ c }: { c: Complaint }) {
  return (
    <Link
      href={`/citizen/complaints/${c.id}`}
      className="pixel-box group flex flex-col overflow-hidden bg-white transition-transform hover:-translate-y-1"
    >
      <div className="relative h-36 border-b-[3px] border-ink">
        <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="400px" className="object-cover" />
        <span className="absolute left-2 top-2 bg-ink px-2 py-1 font-pixel text-[7px] text-coin">{c.id}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-2">
          <SeverityBadge severity={c.severity} />
          <StatusBadge status={c.status} />
        </div>
        <p className="font-bold group-hover:text-mario">{c.title}</p>
        <p className="text-xs text-ink/60">{c.location}</p>
      </div>
    </Link>
  )
}
