'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCityGuardian } from '@/lib/storage'
import { Coin } from '@/components/mario/pixel-ui'
import { mBtn } from './m-ui'

type Review = 'verified' | 'pending' | 'rejected'
const TONE: Record<Review, string> = { verified: 'bg-pipe text-white', pending: 'bg-coin text-ink', rejected: 'bg-mario text-white' }

export function PartnerApprovals() {
  const { partners } = useCityGuardian()
  const [items, setItems] = useState(partners)

  const setStatus = (id: string, status: Review) => {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, status } : x)))
    toast.success(`Partner status updated: ${status}`)
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 text-ink">
      {items.map((p) => (
        <li key={p.id} className="pixel-box flex gap-4 bg-white p-4">
          <div className="relative size-24 shrink-0 overflow-hidden border-2 border-ink">
            <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="96px" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-ink">{p.name}</p>
              <span className={`border-2 border-ink px-2 py-0.5 font-pixel text-[7px] uppercase ${TONE[p.status]}`}>{p.status}</span>
            </div>
            <p className="text-xs text-ink/70">{p.type} - {p.coupons} coupons - {p.redemptions} redemptions - {p.events} events</p>
            <p className="text-xs font-semibold text-amber-700">Impact score: {p.impact} pts</p>
            <div className="mt-auto flex gap-2 pt-2">
              <button className={`${mBtn} bg-pipe text-white`} onClick={() => setStatus(p.id, 'verified')} disabled={p.status === 'verified'}>Approve</button>
              <button className={`${mBtn} bg-mario text-white`} onClick={() => setStatus(p.id, 'rejected')} disabled={p.status === 'rejected'}>Reject</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function CouponApprovals() {
  const { coupons } = useCityGuardian()
  const [items, setItems] = useState(coupons.map((c, i) => ({ ...c, review: (i % 3 === 0 ? 'pending' : 'verified') as Review })))

  const setReview = (id: string, review: Review) => {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, review } : x)))
    toast.success(`Coupon ${review}`)
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-ink">
      {items.map((c) => (
        <li key={c.id} className="pixel-box flex flex-col bg-white">
          <div className="relative h-32 overflow-hidden border-b-[3px] border-ink">
            <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="400px" className="object-cover" />
            <span className={`absolute right-2 top-2 border-2 border-ink px-2 py-0.5 font-pixel text-[7px] uppercase ${TONE[c.review]}`}>{c.review}</span>
          </div>
          <div className="flex flex-1 flex-col gap-1 p-4">
            <p className="font-bold text-ink">{c.title}</p>
            <p className="text-xs text-ink/70">{c.partner} - stock {c.stock}</p>
            <p className="flex items-center gap-1.5 font-pixel text-[9px] text-amber-800"><Coin size={12} spin={false} /> {c.cost} coins</p>
            <div className="mt-auto flex gap-2 pt-3">
              <button className={`${mBtn} bg-pipe text-white`} onClick={() => setReview(c.id, 'verified')} disabled={c.review === 'verified'}>Approve</button>
              <button className={`${mBtn} bg-mario text-white`} onClick={() => setReview(c.id, 'rejected')} disabled={c.review === 'rejected'}>Reject</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
