'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Search, ThumbsUp } from 'lucide-react'
import { useCityGuardian } from '@/lib/storage'
import { WARDS, wardById, type Severity, type Status } from '@/lib/data'
import { CPageHeader } from '@/components/citizen/c-ui'
import { SeverityBadge, StatusBadge, PixelLink } from '@/components/mario/pixel-ui'

const TABS = [
  { key: 'all', label: 'All Issues' },
  { key: 'mine', label: 'My Reports' },
  { key: 'active', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved Victory' },
]

export default function CitizenComplaintsPage() {
  const { complaints, citizen, upvoteComplaint, wards } = useCityGuardian()
  const [tab, setTab] = useState('mine')
  const [q, setQ] = useState('')
  const [selectedWard, setSelectedWard] = useState('all')
  const [selectedSev, setSelectedSev] = useState<Severity | 'All'>('All')

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      // Tab matching
      if (tab === 'mine' && c.reportedBy !== citizen.name) return false
      if (tab === 'active' && !['reported', 'ai_analyzed', 'municipal_verified', 'assigned', 'in_progress'].includes(c.status)) return false
      if (tab === 'resolved' && !['resolved', 'inspection_verified', 'citizen_verified', 'rewarded'].includes(c.status)) return false

      // Ward matching
      if (selectedWard !== 'all' && c.wardId !== selectedWard) return false

      // Severity matching
      if (selectedSev !== 'All' && c.severity !== selectedSev) return false

      // Query matching
      if (q && !`${c.id} ${c.title} ${c.location} ${c.category}`.toLowerCase().includes(q.toLowerCase())) return false

      return true
    })
  }, [complaints, tab, citizen.name, selectedWard, selectedSev, q])

  return (
    <div className="flex flex-col gap-6 text-ink">
      <CPageHeader
        title="Citizen Quest Log"
        subtitle="Track reported issues, monitor municipal progress, and upvote neighborhood priorities."
        action={
          <PixelLink href="/citizen/report" variant="red" className="flex items-center gap-2">
            <PlusCircle className="size-4" /> Report Issue
          </PixelLink>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pixel-press border-[3px] border-ink px-4 py-2 font-pixel text-[9px] uppercase shadow-[3px_3px_0_0_#14101f] transition-all ${
              tab === t.key ? 'bg-amber-400 font-bold text-ink' : 'bg-white text-ink hover:bg-amber-100'
            }`}
          >
            {t.label} (
            {t.key === 'all'
              ? complaints.length
              : t.key === 'mine'
              ? complaints.filter((c) => c.reportedBy === citizen.name).length
              : t.key === 'active'
              ? complaints.filter((c) => ['reported', 'ai_analyzed', 'municipal_verified', 'assigned', 'in_progress'].includes(c.status)).length
              : complaints.filter((c) => ['resolved', 'inspection_verified', 'citizen_verified', 'rewarded'].includes(c.status)).length}
            )
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, ID, area, or category..."
            className="w-full border-[3px] border-ink bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none focus:ring-2 focus:ring-coin"
          />
        </label>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          className="border-[3px] border-ink bg-white px-3 py-2 text-sm text-ink outline-none"
        >
          <option value="all">All Wards</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.official} - {w.game}
            </option>
          ))}
        </select>
        <select
          value={selectedSev}
          onChange={(e) => setSelectedSev(e.target.value as any)}
          className="border-[3px] border-ink bg-white px-3 py-2 text-sm text-ink outline-none"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Grid of Complaints */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full border-[3px] border-dashed border-ink bg-white/90 p-12 text-center">
            <p className="font-pixel text-sm text-ink">No quests match your criteria</p>
            <p className="mt-2 text-sm text-ink/70">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filtered.map((c) => {
            const ward = wardById(c.wardId)
            const isMine = c.reportedBy === citizen.name
            return (
              <div
                key={c.id}
                className="pixel-box group flex flex-col justify-between overflow-hidden bg-white transition-transform hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-44 border-b-[3px] border-ink">
                    <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="400px" className="object-cover" />
                    <span className="absolute left-2 top-2 border border-ink bg-ink px-2 py-1 font-pixel text-[8px] text-coin">
                      {c.id}
                    </span>
                    {isMine && (
                      <span className="absolute right-2 top-2 border border-ink bg-mario px-2 py-1 font-pixel text-[7px] uppercase text-white">
                        My Quest
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex flex-wrap gap-2">
                      <SeverityBadge severity={c.severity} />
                      <StatusBadge status={c.status} />
                    </div>
                    <Link href={`/citizen/complaints/${c.id}`} className="font-bold text-ink hover:text-mario">
                      {c.title}
                    </Link>
                    <p className="text-xs text-ink/65">{c.location} - {ward.official} ({ward.game})</p>
                    <p className="line-clamp-2 text-xs text-ink/80">{c.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-ink/10 bg-amber-50/50 p-3">
                  <button
                    type="button"
                    onClick={() => upvoteComplaint(c.id)}
                    className="pixel-press flex items-center gap-1.5 border border-ink bg-white px-2.5 py-1 text-xs font-bold hover:bg-amber-200"
                    title="Upvote to boost municipal priority"
                  >
                    <ThumbsUp className="size-3.5 text-amber-600" />
                    <span>{c.upvotes} Upvotes</span>
                  </button>

                  <Link
                    href={`/citizen/complaints/${c.id}`}
                    className="border border-ink bg-ink px-3 py-1 font-pixel text-[8px] uppercase text-white hover:bg-coin hover:text-ink"
                  >
                    View Quest {'>'}
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

