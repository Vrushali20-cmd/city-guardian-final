'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Check, Search, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCityGuardian } from '@/lib/storage'
import { wardById, type Severity, type Status } from '@/lib/data'
import { SeverityBadge, StatusBadge } from '@/components/mario/pixel-ui'
import { Countdown } from '@/components/mario/timers'
import { mBtn } from './m-ui'

const TABS: { key: string; label: string; match: (s: Status) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'verify', label: 'To verify', match: (s) => s === 'reported' || s === 'ai_analyzed' },
  { key: 'active', label: 'Active', match: (s) => ['municipal_verified', 'assigned', 'in_progress'].includes(s) },
  { key: 'done', label: 'Resolved', match: (s) => ['resolved', 'inspection_verified', 'citizen_verified', 'rewarded'].includes(s) },
  { key: 'issues', label: 'Disputed', match: (s) => ['rejected', 'disputed', 'rework'].includes(s) },
]

const SEVERITIES: (Severity | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low']

export function ComplaintQueue() {
  const { complaints, updateComplaintStatus, wards } = useCityGuardian()
  const [tab, setTab] = useState('all')
  const [sev, setSev] = useState<Severity | 'All'>('All')
  const [ward, setWard] = useState('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = TABS.find((x) => x.key === tab)!
    return complaints.filter(
      (c) =>
        t.match(c.status) &&
        (sev === 'All' || c.severity === sev) &&
        (ward === 'all' || c.wardId === ward) &&
        (q === '' || `${c.id} ${c.title} ${c.location}`.toLowerCase().includes(q.toLowerCase())),
    )
  }, [complaints, tab, sev, ward, q])

  const update = (id: string, status: Status, msg: string) => {
    updateComplaintStatus(id, status)
    toast.success(msg)
  }

  return (
    <div className="flex flex-col gap-5 text-ink">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Complaint filters">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`${mBtn} ${tab === t.key ? 'bg-amber-400 text-ink font-bold' : 'bg-white text-ink hover:bg-amber-100'}`}
          >
            {t.label} ({complaints.filter((c) => t.match(c.status)).length})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search complaints</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/50" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ID, title, location..."
            className="w-full border-[3px] border-ink bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none focus-visible:ring-3 focus-visible:ring-coin"
          />
        </label>
        <label>
          <span className="sr-only">Severity</span>
          <select
            value={sev}
            onChange={(e) => setSev(e.target.value as Severity | 'All')}
            className="h-full border-[3px] border-ink bg-white px-3 text-sm text-ink outline-none"
          >
            {SEVERITIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Ward</span>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="h-full border-[3px] border-ink bg-white px-3 text-sm text-ink outline-none"
          >
            <option value="all">All wards</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.official} - {w.game}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <li className="border-[3px] border-dashed border-ink bg-amber-50/60 p-10 text-center font-pixel text-[9px] uppercase text-ink/70">
            No complaints in this category
          </li>
        )}
        {filtered.map((c) => (
          <li key={c.id} className="pixel-box flex flex-col gap-4 bg-white p-4 md:flex-row">
            <div className="relative h-32 w-full shrink-0 overflow-hidden border-2 border-ink md:w-44">
              <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="176px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[8px] text-ink/70">{c.id}</span>
                <SeverityBadge severity={c.severity} />
                <StatusBadge status={c.status} />
                <span className="text-xs text-ink/70 font-semibold">AI {c.ai.confidence}%</span>
              </div>
              <Link href={`/municipal/complaints/${c.id}`} className="font-bold text-ink hover:text-mario">
                {c.title}
              </Link>
              <p className="text-xs text-ink/70">
                {c.location} - {wardById(c.wardId).official} ({wardById(c.wardId).game}) - {c.upvotes} upvotes
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                {(c.status === 'reported' || c.status === 'ai_analyzed') && (
                  <>
                    <button className={`${mBtn} bg-pipe text-white`} onClick={() => update(c.id, 'municipal_verified', `${c.id} verified`)}>
                      <Check className="size-3" aria-hidden /> Verify
                    </button>
                    <button className={`${mBtn} bg-mario text-white`} onClick={() => update(c.id, 'rejected', `${c.id} rejected`)}>
                      <X className="size-3" aria-hidden /> Reject
                    </button>
                  </>
                )}
                {c.status === 'municipal_verified' && (
                  <button className={`${mBtn} bg-coin text-ink`} onClick={() => update(c.id, 'assigned', `${c.id} assigned to ward team`)}>
                    <UserPlus className="size-3" aria-hidden /> Assign team
                  </button>
                )}
                {['assigned', 'in_progress'].includes(c.status) && <Countdown deadline={c.deadline} />}
                <Link href={`/municipal/complaints/${c.id}`} className={`${mBtn} ml-auto bg-amber-200 text-ink hover:bg-amber-300`}>
                  Open
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
