'use client'

import { toast } from 'sonner'
import { useCityGuardian } from '@/lib/storage'
import { wardById, type Status } from '@/lib/data'
import { SeverityBadge } from '@/components/mario/pixel-ui'
import { Countdown } from '@/components/mario/timers'
import { mBtn } from './m-ui'

const COLUMNS: { status: Status; title: string; next?: Status; nextLabel?: string; color: string; badgeBg: string }[] = [
  { status: 'municipal_verified', title: 'Ready', next: 'assigned', nextLabel: 'Assign', color: 'border-t-sky', badgeBg: 'bg-sky text-white' },
  { status: 'assigned', title: 'Assigned', next: 'in_progress', nextLabel: 'Start', color: 'border-t-coin', badgeBg: 'bg-coin text-ink' },
  { status: 'in_progress', title: 'In progress', next: 'resolved', nextLabel: 'Resolve', color: 'border-t-sunset', badgeBg: 'bg-sunset text-ink' },
  { status: 'resolved', title: 'Resolved', color: 'border-t-pipe', badgeBg: 'bg-pipe text-white' },
]

export function MissionBoard() {
  const { complaints, updateComplaintStatus } = useCityGuardian()

  const move = (id: string, to: Status) => {
    updateComplaintStatus(id, to)
    toast.success(`${id} moved to ${to.replace('_', ' ')}`)
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const list = complaints.filter((c) => c.status === col.status)
        return (
          <section key={col.status} className={`pixel-box border-t-8 bg-white text-ink ${col.color}`}>
            <h2 className="flex items-center justify-between border-b-2 border-ink bg-amber-50 px-4 py-3 font-pixel text-[9px] uppercase">
              {col.title}
              <span className={`border border-ink px-2 py-0.5 font-bold ${col.badgeBg}`}>{list.length}</span>
            </h2>
            <ul className="flex min-h-48 flex-col gap-3 p-3">
              {list.map((c) => (
                <li key={c.id} className="pixel-box-sm animate-rise-in bg-amber-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[8px] text-ink/70">{c.id}</span>
                    <SeverityBadge severity={c.severity} />
                  </div>
                  <p className="mt-2 text-sm font-bold text-ink">{c.title}</p>
                  <p className="text-xs text-ink/70">{wardById(c.wardId).game}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Countdown deadline={c.deadline} />
                    {col.next && (
                      <button className={`${mBtn} bg-coin text-ink hover:bg-amber-300`} onClick={() => move(c.id, col.next!)}>
                        {col.nextLabel}
                      </button>
                    )}
                  </div>
                </li>
              ))}
              {list.length === 0 && <li className="py-8 text-center font-pixel text-[8px] uppercase text-ink/40">No missions</li>}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
