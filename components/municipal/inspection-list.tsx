'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCityGuardian } from '@/lib/storage'
import { wardById, type Status } from '@/lib/data'
import { StatusBadge } from '@/components/mario/pixel-ui'
import { mBtn } from './m-ui'

export function InspectionList() {
  const { complaints, updateComplaintStatus, updateComplaintAfterImage } = useCityGuardian()
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)

  const items = complaints.filter((c) => ['assigned', 'in_progress', 'resolved', 'inspection_verified', 'disputed', 'rework'].includes(c.status))

  const setStatus = (id: string, status: Status, msg: string) => {
    updateComplaintStatus(id, status)
    toast.success(msg)
  }

  const handleUploadAfterPhoto = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFor(id)
    const toastId = toast.loading('Uploading after-fix photo...')

    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (json.success && json.url) {
        await updateComplaintAfterImage(id, json.url)
        toast.success('Fix photo uploaded and saved to MongoDB! Status marked Resolved.', { id: toastId })
      } else {
        const reader = new FileReader()
        reader.onloadend = async () => {
          await updateComplaintAfterImage(id, reader.result as string)
          toast.success('Fix photo saved!', { id: toastId })
        }
        reader.readAsDataURL(file)
      }
    } catch {
      const reader = new FileReader()
      reader.onloadend = async () => {
        await updateComplaintAfterImage(id, reader.result as string)
        toast.success('Fix photo saved!', { id: toastId })
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingFor(null)
    }
  }

  return (
    <ul className="grid gap-6 lg:grid-cols-2 text-ink">
      {items.length === 0 && (
        <li className="col-span-full border-[3px] border-dashed border-ink bg-amber-50/60 p-10 text-center font-pixel text-[9px] uppercase text-ink/70">
          No inspections or active repairs pending at this time
        </li>
      )}
      {items.map((c) => (
        <li key={c.id} className="pixel-box bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-pixel text-[8px] text-ink/70">{c.id} - {wardById(c.wardId).official}</span>
            <StatusBadge status={c.status} />
          </div>
          <p className="mt-2 font-bold text-ink">{c.title}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ['Before Photo', c.image],
              ['After Fix Proof', c.afterImage],
            ].map(([label, src]) => (
              <figure key={label}>
                <div className="relative grid aspect-video place-items-center overflow-hidden border-2 border-ink bg-sand/30">
                  {src ? (
                    <Image src={src || '/placeholder.svg'} alt={`${label}: ${c.title}`} fill sizes="300px" className="object-cover" />
                  ) : (
                    <div className="p-2 text-center">
                      <span className="text-xl">📸</span>
                      <p className="font-pixel text-[6px] uppercase text-ink/50 mt-1">Pending Fix Proof</p>
                    </div>
                  )}
                </div>
                <figcaption className="mt-1 font-pixel text-[7px] uppercase text-ink/70">{label}</figcaption>
              </figure>
            ))}
          </div>

          {/* Upload Fix Photo Action */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-ink/10 pt-3">
            <label className="pixel-press inline-flex cursor-pointer items-center gap-1.5 border-2 border-ink bg-coin px-3 py-1.5 font-pixel text-[8px] uppercase text-ink hover:bg-amber-300">
              {uploadingFor === c.id ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="size-3.5" />
                  <span>Upload Fix Photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingFor === c.id}
                onChange={(e) => handleUploadAfterPhoto(c.id, e)}
                className="hidden"
              />
            </label>

            {(c.status === 'resolved' || c.status === 'disputed') && (
              <>
                <button className={`${mBtn} bg-pipe text-white hover:bg-pipe-dark`} onClick={() => setStatus(c.id, 'inspection_verified', `${c.id} inspection approved`)}>
                  Approve Fix
                </button>
                <button className={`${mBtn} bg-mario text-white hover:bg-brick-dark`} onClick={() => setStatus(c.id, 'rework', `${c.id} sent for rework`)}>
                  Rework
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
