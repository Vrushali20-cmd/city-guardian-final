'use client'

import Image from 'next/image'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useCityGuardian } from '@/lib/storage'
import { type CityEvent } from '@/lib/data'

export function EventManager({
  host,
  dark = false,
  kinds,
  accent,
}: {
  host: string
  dark?: boolean
  kinds: CityEvent['kind'][]
  accent: string
}) {
  const { events, addEvent } = useCityGuardian()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const ev: CityEvent = {
      id: `e${Date.now()}`,
      title: String(f.get('title')),
      host,
      date: new Date(String(f.get('date'))).toISOString(),
      place: String(f.get('place')),
      points: Number(f.get('points') || 0),
      rsvps: 0,
      image: '/images/cleanup.png',
      kind: f.get('kind') as CityEvent['kind'],
    }
    addEvent(ev)
    e.currentTarget.reset()
    toast.success('Event published! Citizens can now RSVP.')
  }

  const panel = 'pixel-box bg-white text-ink'
  const input = 'border-[3px] border-ink bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-coin'

  return (
    <div className="grid gap-8 lg:grid-cols-3 text-ink">
      <form onSubmit={onSubmit} className={cn(panel, 'flex h-fit flex-col gap-4 p-5')}>
        <h2 className="font-pixel text-[10px] uppercase text-ink">Create city event</h2>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Title
          <input name="title" required className={input} placeholder="Sunday cleanliness drive" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Type
          <select name="kind" className={input}>
            {kinds.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Date
          <input name="date" type="date" required className={input} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Place
          <input name="place" required className={input} placeholder="Rajwada Palace" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Bonus Guardian Coins
          <input name="points" type="number" min={0} max={100} defaultValue={25} className={input} />
        </label>
        <button
          type="submit"
          className={cn(
            'pixel-press border-[3px] border-ink px-4 py-3 font-pixel text-[9px] uppercase shadow-[4px_4px_0_0_#14101f]',
            accent,
          )}
        >
          Publish Event
        </button>
      </form>
      <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
        {events.map((ev) => (
          <li key={ev.id} className={cn(panel, 'animate-rise-in overflow-hidden')}>
            <div className="relative h-36 border-b-[3px] border-ink">
              <Image src={ev.image || '/placeholder.svg'} alt={ev.title} fill sizes="400px" className="object-cover" />
              <span className="absolute left-2 top-2 border border-ink bg-ink px-2 py-1 font-pixel text-[7px] uppercase text-coin">
                {ev.kind}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 text-sm">
              <p className="font-bold text-ink">{ev.title}</p>
              <p className="text-ink/70">by {ev.host}</p>
              <p className="flex items-center gap-2 text-ink/80 font-medium">
                <CalendarDays className="size-4" aria-hidden />
                {new Date(ev.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
              <p className="flex items-center gap-2 text-ink/80 font-medium">
                <MapPin className="size-4" aria-hidden />
                {ev.place}
              </p>
              <p className="flex items-center gap-2 font-bold text-amber-700">
                <Users className="size-4" aria-hidden />
                {ev.rsvps} RSVPs - +{ev.points} pts
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
