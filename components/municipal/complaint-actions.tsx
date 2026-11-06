'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Status } from '@/lib/data'
import { useCityGuardian } from '@/lib/storage'
import { StatusBadge } from '@/components/mario/pixel-ui'
import { LifecycleTrack } from '@/components/portal/lifecycle-track'
import { mBtn } from './m-ui'

const NEXT: Partial<Record<Status, { to: Status; label: string; cls: string }[]>> = {
  reported: [
    { to: 'municipal_verified', label: 'Verify', cls: 'bg-pipe text-white' },
    { to: 'rejected', label: 'Reject', cls: 'bg-mario text-white' },
  ],
  ai_analyzed: [
    { to: 'municipal_verified', label: 'Verify', cls: 'bg-pipe text-white' },
    { to: 'rejected', label: 'Reject', cls: 'bg-mario text-white' },
  ],
  municipal_verified: [{ to: 'assigned', label: 'Assign ward team', cls: 'bg-coin text-ink' }],
  assigned: [{ to: 'in_progress', label: 'Mark in progress', cls: 'bg-sunset text-ink' }],
  in_progress: [{ to: 'resolved', label: 'Mark resolved', cls: 'bg-pipe text-white' }],
  resolved: [
    { to: 'inspection_verified', label: 'Inspection approve', cls: 'bg-pipe text-white' },
    { to: 'rework', label: 'Send for rework', cls: 'bg-mario text-white' },
  ],
  rework: [{ to: 'in_progress', label: 'Restart work', cls: 'bg-sunset text-ink' }],
  disputed: [{ to: 'rework', label: 'Accept dispute', cls: 'bg-mario text-white' }],
}

export function ComplaintActions({ id, initial }: { id?: string; initial: Status }) {
  const [status, setStatus] = useState<Status>(initial)
  const { updateComplaintStatus } = useCityGuardian()
  const actions = NEXT[status] ?? []

  const onSelectAction = (to: Status, label: string) => {
    setStatus(to)
    if (id) {
      updateComplaintStatus(id, to)
    }
    toast.success(`Status updated: ${label}`)
  }

  return (
    <div className="flex flex-col gap-5 text-ink">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-ink/80">Current:</span>
        <StatusBadge status={status} />
      </div>
      <LifecycleTrack status={status} dark={false} />
      {actions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.to}
              className={`${mBtn} ${a.cls}`}
              onClick={() => onSelectAction(a.to, a.label)}
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink/60">No municipal action needed at this stage.</p>
      )}
    </div>
  )
}
