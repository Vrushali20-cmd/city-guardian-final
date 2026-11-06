'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  COMPLAINTS,
  COUPONS,
  CURRENT_CITIZEN,
  EVENTS,
  PARTNERS,
  WARDS,
  type Complaint,
  type Coupon,
  type CityEvent,
  type Partner,
  type Status,
  type Ward,
} from './data'

export type RedeemedItem = {
  id: string
  couponId: string
  title: string
  partner: string
  code: string
  cost: number
  redeemedAt: string
  category: string
  status: 'active' | 'used'
}

export type CitizenProfile = {
  name: string
  email: string
  ward: string
  zone: string
  points: number
  gems: number
  elixir: number
  clan: string
  clanRole: string
  clanTrophies: number
  townHallLevel: number
  level: number
  xp: number
  avatar: string
  title: string
  badges: string[]
  redeemedCoupons: RedeemedItem[]
  rsvpedEventIds: string[]
}

const STORAGE_KEYS = {
  COMPLAINTS: 'cg_complaints_v3',
  CITIZEN: 'cg_citizen_v3',
  COUPONS: 'cg_coupons_v3',
  EVENTS: 'cg_events_v3',
  WARDS: 'cg_wards_v3',
  PARTNERS: 'cg_partners_v3',
}

const INITIAL_CITIZEN: CitizenProfile = {
  ...CURRENT_CITIZEN,
  gems: 75,
  elixir: 450,
  clan: 'Holkar Heroes',
  clanRole: 'Co-Leader',
  clanTrophies: 1840,
  townHallLevel: 8,
  avatar: 'mario',
  title: 'Master Pothole Smasher',
  badges: [
    'First Report',
    'Pothole Hunter',
    'Night Watch',
    'Gold Guardian',
    'Event Hero',
    'Clan Champion',
    'Indore Swachhata Knight',
  ],
  redeemedCoupons: [
    {
      id: 'rc-1',
      couponId: 'c1',
      title: 'Free Cold Coffee',
      partner: 'Chhappan Brew Co.',
      code: 'COC-CHHAPPAN-7842',
      cost: 80,
      redeemedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      category: 'Cafe',
      status: 'active',
    },
  ],
  rsvpedEventIds: ['e1'],
}

// Helpers
function isClient() {
  return typeof window !== 'undefined'
}

function notifyUpdate() {
  if (isClient()) {
    window.dispatchEvent(new Event('cg_storage_sync'))
  }
}

// Safe async API sync helpers
async function syncToApi(endpoint: string, method: string, body?: any) {
  if (!isClient()) return null
  try {
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    return await res.json()
  } catch (err) {
    console.warn(`[MongoDB Sync] ${endpoint} deferred:`, err)
    return null
  }
}

// Data loaders
export function getStoredComplaints(): Complaint[] {
  if (!isClient()) return COMPLAINTS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(COMPLAINTS))
      return COMPLAINTS
    }
    return JSON.parse(raw)
  } catch {
    return COMPLAINTS
  }
}

export function getStoredCitizen(): CitizenProfile {
  if (!isClient()) return INITIAL_CITIZEN
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CITIZEN)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(INITIAL_CITIZEN))
      return INITIAL_CITIZEN
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_CITIZEN
  }
}

export function getStoredCoupons(): Coupon[] {
  if (!isClient()) return COUPONS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPONS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(COUPONS))
      return COUPONS
    }
    return JSON.parse(raw)
  } catch {
    return COUPONS
  }
}

export function getStoredEvents(): CityEvent[] {
  if (!isClient()) return EVENTS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(EVENTS))
      return EVENTS
    }
    return JSON.parse(raw)
  } catch {
    return EVENTS
  }
}

export function getStoredWards(): Ward[] {
  if (!isClient()) return WARDS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WARDS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WARDS, JSON.stringify(WARDS))
      return WARDS
    }
    return JSON.parse(raw)
  } catch {
    return WARDS
  }
}

export function getStoredPartners(): Partner[] {
  if (!isClient()) return PARTNERS
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTNERS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(PARTNERS))
      return PARTNERS
    }
    return JSON.parse(raw)
  } catch {
    return PARTNERS
  }
}

// State modifiers
export async function addComplaintStorage(newComplaint: Complaint): Promise<Complaint> {
  const all = getStoredComplaints()
  const updated = [newComplaint, ...all]
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated))
    // Give citizen rewards
    const citizen = getStoredCitizen()
    const newXp = citizen.xp + 25
    const levelUp = newXp >= 100
    const updatedCitizen: CitizenProfile = {
      ...citizen,
      points: citizen.points + 40,
      gems: citizen.gems + 5,
      xp: levelUp ? newXp - 100 : newXp,
      level: levelUp ? citizen.level + 1 : citizen.level,
      clanTrophies: citizen.clanTrophies + 30,
    }
    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(updatedCitizen))

    // Update ward count
    const wards = getStoredWards()
    const updatedWards = wards.map((w) =>
      w.id === newComplaint.wardId ? { ...w, pending: w.pending + 1, points: w.points + 10 } : w,
    )
    localStorage.setItem(STORAGE_KEYS.WARDS, JSON.stringify(updatedWards))

    // MongoDB Sync
    await syncToApi('/api/complaints', 'POST', newComplaint)
  }
  notifyUpdate()
  return newComplaint
}

export async function updateComplaintStatusStorage(id: string, status: Status): Promise<Complaint | null> {
  const all = getStoredComplaints()
  let target: Complaint | null = null
  const updated = all.map((c) => {
    if (c.id === id) {
      target = { ...c, status }
      return target
    }
    return c
  })

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated))

    if (status === 'resolved' || status === 'citizen_verified' || status === 'rewarded') {
      const citizen = getStoredCitizen()
      const wards = getStoredWards()
      if (target) {
        const t = target as Complaint
        const updatedWards = wards.map((w) =>
          w.id === t.wardId ? { ...w, resolved: w.resolved + 1, pending: Math.max(0, w.pending - 1), points: w.points + 50 } : w,
        )
        localStorage.setItem(STORAGE_KEYS.WARDS, JSON.stringify(updatedWards))
      }
      if (status === 'rewarded') {
        localStorage.setItem(
          STORAGE_KEYS.CITIZEN,
          JSON.stringify({ ...citizen, points: citizen.points + 50, gems: citizen.gems + 10 }),
        )
      }
    }

    // MongoDB Sync
    await syncToApi(`/api/complaints/${id}`, 'PATCH', { status })
  }
  notifyUpdate()
  return target
}

export async function updateComplaintAfterImageStorage(id: string, afterImage: string): Promise<void> {
  const all = getStoredComplaints()
  const updated = all.map((c) => (c.id === id ? { ...c, afterImage, status: 'resolved' as Status } : c))
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated))
    await syncToApi(`/api/complaints/${id}`, 'PATCH', { afterImage, status: 'resolved' })
  }
  notifyUpdate()
}

export async function upvoteComplaintStorage(id: string): Promise<number> {
  const all = getStoredComplaints()
  let count = 0
  const updated = all.map((c) => {
    if (c.id === id) {
      count = c.upvotes + 1
      return { ...c, upvotes: count }
    }
    return c
  })
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated))
    // MongoDB Sync
    await syncToApi(`/api/complaints/${id}`, 'PATCH', { action: 'upvote' })
  }
  notifyUpdate()
  return count
}

export async function updateCitizenStorage(updates: Partial<CitizenProfile>): Promise<CitizenProfile> {
  const current = getStoredCitizen()
  const merged = { ...current, ...updates }
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(merged))
    // MongoDB Sync
    await syncToApi('/api/citizen', 'PATCH', updates)
  }
  notifyUpdate()
  return merged
}

export async function redeemCouponStorage(couponId: string): Promise<{ success: boolean; message: string; voucher?: RedeemedItem }> {
  const citizen = getStoredCitizen()
  const coupons = getStoredCoupons()
  const coupon = coupons.find((c) => c.id === couponId)

  if (!coupon) return { success: false, message: 'Coupon not found!' }
  if (citizen.points < coupon.cost) {
    return { success: false, message: `Need ${coupon.cost - citizen.points} more coins to unlock this loot!` }
  }
  if (coupon.stock <= 0) {
    return { success: false, message: 'Sold out in the Clan Market!' }
  }

  // Deduct coins & generate voucher
  const voucherCode = `MARIO-${coupon.partner.replace(/\s+/g, '').toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`
  const voucher: RedeemedItem = {
    id: `voucher-${Date.now()}`,
    couponId: coupon.id,
    title: coupon.title,
    partner: coupon.partner,
    code: voucherCode,
    cost: coupon.cost,
    redeemedAt: new Date().toISOString(),
    category: coupon.category,
    status: 'active',
  }

  const updatedCitizen: CitizenProfile = {
    ...citizen,
    points: citizen.points - coupon.cost,
    redeemedCoupons: [voucher, ...citizen.redeemedCoupons],
    xp: citizen.xp + 15,
  }

  const updatedCoupons = coupons.map((c) => (c.id === couponId ? { ...c, stock: c.stock - 1 } : c))

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(updatedCitizen))
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(updatedCoupons))
    // MongoDB Sync
    await syncToApi('/api/coupons', 'POST', { action: 'redeem', couponId })
  }
  notifyUpdate()
  return { success: true, message: `Redeemed ${coupon.title}! Saved in My Loot.`, voucher }
}

export async function toggleEventRsvpStorage(eventId: string): Promise<{ rsvped: boolean; count: number }> {
  const citizen = getStoredCitizen()
  const events = getStoredEvents()
  const isRsvped = citizen.rsvpedEventIds.includes(eventId)

  const updatedRsvpIds = isRsvped
    ? citizen.rsvpedEventIds.filter((id) => id !== eventId)
    : [...citizen.rsvpedEventIds, eventId]

  let newCount = 0
  const updatedEvents = events.map((ev) => {
    if (ev.id === eventId) {
      newCount = isRsvped ? Math.max(0, ev.rsvps - 1) : ev.rsvps + 1
      return { ...ev, rsvps: newCount }
    }
    return ev
  })

  const bonusPoints = !isRsvped ? 25 : 0
  const updatedCitizen: CitizenProfile = {
    ...citizen,
    points: citizen.points + bonusPoints,
    rsvpedEventIds: updatedRsvpIds,
  }

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents))
    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(updatedCitizen))
    // MongoDB Sync
    await syncToApi('/api/events', 'POST', { action: 'rsvp', eventId })
  }
  notifyUpdate()
  return { rsvped: !isRsvped, count: newCount }
}

export async function addEventStorage(event: CityEvent): Promise<CityEvent> {
  const events = getStoredEvents()
  const updated = [event, ...events]
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated))
    // MongoDB Sync
    await syncToApi('/api/events', 'POST', event)
  }
  notifyUpdate()
  return event
}

export async function addCouponStorage(coupon: Coupon): Promise<Coupon> {
  const coupons = getStoredCoupons()
  const updated = [coupon, ...coupons]
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(updated))
    // MongoDB Sync
    await syncToApi('/api/coupons', 'POST', coupon)
  }
  notifyUpdate()
  return coupon
}

// React Hook for live synced access
export function useCityGuardian() {
  const [complaints, setComplaints] = useState<Complaint[]>(getStoredComplaints)
  const [citizen, setCitizen] = useState<CitizenProfile>(getStoredCitizen)
  const [coupons, setCoupons] = useState<Coupon[]>(getStoredCoupons)
  const [events, setEvents] = useState<CityEvent[]>(getStoredEvents)
  const [wards, setWards] = useState<Ward[]>(getStoredWards)
  const [partners, setPartners] = useState<Partner[]>(getStoredPartners)
  const [isReady, setIsReady] = useState(false)

  const sync = useCallback(() => {
    setComplaints(getStoredComplaints())
    setCitizen(getStoredCitizen())
    setCoupons(getStoredCoupons())
    setEvents(getStoredEvents())
    setWards(getStoredWards())
    setPartners(getStoredPartners())
  }, [])

  useEffect(() => {
    setIsReady(true)
    sync()

    // Query MongoDB directly on load & seed if empty
    fetch('/api/seed')
      .then((r) => r.json())
      .then(async () => {
        // Fetch fresh complaints from MongoDB
        try {
          const res = await fetch('/api/complaints')
          const json = await res.json()
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(json.data))
            setComplaints(json.data)
          }
        } catch {}

        // Fetch citizen profile from MongoDB
        try {
          const cRes = await fetch('/api/citizen')
          const cJson = await cRes.json()
          if (cJson.success && cJson.data) {
            localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(cJson.data))
            setCitizen(cJson.data)
          }
        } catch {}

        // Fetch coupons & events
        try {
          const cpRes = await fetch('/api/coupons')
          const cpJson = await cpRes.json()
          if (cpJson.success && Array.isArray(cpJson.data) && cpJson.data.length > 0) {
            localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(cpJson.data))
            setCoupons(cpJson.data)
          }
        } catch {}

        try {
          const evRes = await fetch('/api/events')
          const evJson = await evRes.json()
          if (evJson.success && Array.isArray(evJson.data) && evJson.data.length > 0) {
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(evJson.data))
            setEvents(evJson.data)
          }
        } catch {}
      })
      .catch((err) => {
        console.warn('MongoDB initial sync deferred to local storage:', err)
      })

    window.addEventListener('cg_storage_sync', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cg_storage_sync', sync)
      window.removeEventListener('storage', sync)
    }
  }, [sync])

  return {
    isReady,
    complaints,
    citizen,
    coupons,
    events,
    wards,
    partners,
    addComplaint: addComplaintStorage,
    updateComplaintStatus: updateComplaintStatusStorage,
    updateComplaintAfterImage: updateComplaintAfterImageStorage,
    upvoteComplaint: upvoteComplaintStorage,
    updateCitizen: updateCitizenStorage,
    redeemCoupon: redeemCouponStorage,
    toggleRsvp: toggleEventRsvpStorage,
    addEvent: addEventStorage,
    addCoupon: addCouponStorage,
    refresh: sync,
  }
}
