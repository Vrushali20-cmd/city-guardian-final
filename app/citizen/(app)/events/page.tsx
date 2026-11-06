'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CalendarDays, MapPin, Users, CheckCircle, Sparkles, Filter } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { type CityEvent } from '@/lib/data'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin } from '@/components/mario/pixel-ui'

const KINDS = ['All', 'Drive', 'Plantation', 'Workshop', 'Notice']

export default function CitizenEventsPage() {
  const { events, citizen, toggleRsvp } = useCityGuardian()
  const [filterKind, setFilterKind] = useState('All')
  const [onlyRsvped, setOnlyRsvped] = useState(false)

  const filteredEvents = events.filter((ev) => {
    if (filterKind !== 'All' && ev.kind !== filterKind) return false
    if (onlyRsvped && !citizen.rsvpedEventIds?.includes(ev.id)) return false
    return true
  })

  const handleToggleRsvp = (eventId: string, title: string) => {
    const res = toggleRsvp(eventId)
    if (res.rsvped) {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } })
      toast.success(`🎉 RSVP Confirmed for ${title}!`, {
        description: '+25 Guardian Coins added to your account for joining this raid.',
      })
    } else {
      toast.info(`RSVP cancelled for ${title}.`)
    }
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="City Drives & Clan Raids"
        subtitle="Team up with fellow guardians for weekend cleanup drives, tree plantations, and earn clan bonus coins!"
      />

      {/* Hero Announcement */}
      <CCard className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-green-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center border-[3px] border-ink bg-pipe text-white">
              <Sparkles className="size-8" />
            </div>
            <div>
              <span className="font-pixel text-[8px] uppercase font-bold text-emerald-950">Special Community Event</span>
              <h2 className="font-pixel text-base text-ink sm:text-lg">Raipur Mega Swachhata Drive</h2>
              <p className="mt-1 text-xs text-ink/80">Join 300+ guardians across 5 Raipur zones this Sunday - +50 Coins & Free Breakfast Voucher!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-2 border-ink bg-white/95 px-3 py-2 font-pixel text-xs text-emerald-900">
            <span>Your RSVPs: {citizen.rsvpedEventIds?.length || 0}</span>
          </div>
        </div>
      </CCard>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-2">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => {
                setFilterKind(k)
                setOnlyRsvped(false)
              }}
              className={`pixel-press border-[2px] border-ink px-3 py-1.5 font-pixel text-[8px] uppercase transition-all ${
                !onlyRsvped && filterKind === k
                  ? 'bg-amber-400 font-bold text-ink shadow-[2px_2px_0_0_#14101f]'
                  : 'bg-white text-ink hover:bg-amber-100'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyRsvped(!onlyRsvped)}
          className={`pixel-press flex items-center gap-2 border-[2px] border-ink px-3 py-1.5 font-pixel text-[8px] uppercase shadow-[2px_2px_0_0_#14101f] ${
            onlyRsvped ? 'bg-pipe text-white' : 'bg-white text-ink'
          }`}
        >
          <CheckCircle className="size-3.5" />
          <span>My RSVPs Only</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full border-[3px] border-dashed border-ink bg-white/90 p-12 text-center">
            <p className="font-pixel text-sm text-ink">No events match your selection</p>
            <p className="mt-2 text-sm text-ink/70">Check back soon for new municipal drives and clan workshops!</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isRsvped = citizen.rsvpedEventIds?.includes(ev.id)
            return (
              <div
                key={ev.id}
                className="pixel-box group flex flex-col justify-between overflow-hidden bg-white transition-transform hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-48 border-b-[3px] border-ink">
                    <Image src={ev.image || '/placeholder.svg'} alt={ev.title} fill sizes="600px" className="object-cover" />
                    <span className="absolute left-2 top-2 border border-ink bg-ink px-2 py-1 font-pixel text-[8px] uppercase text-coin">
                      {ev.kind}
                    </span>
                    {isRsvped && (
                      <span className="absolute right-2 top-2 border border-ink bg-pipe px-2 py-1 font-pixel text-[7px] uppercase text-white">
                        ✓ Registered
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 p-5">
                    <h3 className="font-pixel text-sm uppercase text-ink group-hover:text-mario">{ev.title}</h3>
                    <p className="text-xs font-semibold text-ink/70">Organized by {ev.host}</p>

                    <div className="flex flex-col gap-1.5 text-xs text-ink/80">
                      <p className="flex items-center gap-2 font-medium">
                        <CalendarDays className="size-4 text-mario" />
                        <span>{new Date(ev.date).toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
                      </p>
                      <p className="flex items-center gap-2 font-medium">
                        <MapPin className="size-4 text-pipe-dark" />
                        <span>{ev.place}</span>
                      </p>
                      <p className="flex items-center gap-2 font-bold text-amber-800">
                        <Users className="size-4 text-amber-700" />
                        <span>{ev.rsvps} Citizens Registered</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-ink/10 bg-amber-50/70 p-4">
                  <div className="flex items-center gap-1.5 font-pixel text-xs text-amber-900 font-bold">
                    <Coin size={14} spin={false} />
                    <span>+{ev.points} Coins Bounty</span>
                  </div>

                  {ev.kind === 'Notice' ? (
                    <span className="font-pixel text-[8px] uppercase text-ink/60">Official Advisory</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleRsvp(ev.id, ev.title)}
                      className={`pixel-press border-[2px] border-ink px-4 py-2 font-pixel text-[8px] uppercase shadow-[2px_2px_0_0_#14101f] transition-all ${
                        isRsvped
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-pipe text-white hover:bg-pipe-dark'
                      }`}
                    >
                      {isRsvped ? 'Cancel RSVP' : 'Join Raid / RSVP'}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

