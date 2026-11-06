'use client'

import Link from 'next/link'
import { Camera, Gift, Trophy, Shield, Sparkles, Flame } from 'lucide-react'
import { POINT_RULES } from '@/lib/data'
import { useCityGuardian } from '@/lib/storage'
import { CCard, CPageHeader, ComplaintTile } from '@/components/citizen/c-ui'
import { Coin, PixelLink, QBlock } from '@/components/mario/pixel-ui'
import { GuardianHero } from '@/components/mario/sprites'

export default function CitizenDashboard() {
  const { citizen, complaints, events, upvoteComplaint } = useCityGuardian()

  const mine = complaints.filter((c) => c.reportedBy === citizen.name)
  const nearby = complaints.filter((c) => c.reportedBy !== citizen.name).slice(0, 3)

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title={`Hi, ${citizen.name.split(' ')[0]}!`}
        subtitle={`${citizen.ward} (${citizen.clan}) - Level ${citizen.level} Guardian`}
      />

      {/* Clash of Clans Town Hall / Clan Stats Banner */}
      <div className="grid gap-6 lg:grid-cols-3">
        <CCard className="flex flex-col gap-4 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100 lg:col-span-2">
          <div className="flex items-center gap-5">
            <GuardianHero size={5} className="hidden animate-hop sm:block" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-[9px] uppercase tracking-wider text-ink font-bold">
                  Town Hall Lvl {citizen.townHallLevel} - Guardian Lvl {citizen.level}
                </span>
                <span className="flex items-center gap-1 font-pixel text-[8px] bg-white/80 border border-ink px-2 py-0.5">
                  <Shield className="size-3 text-blue-600" /> {citizen.clan}
                </span>
              </div>
              <div
                className="mt-2 h-5 border-[3px] border-ink bg-white"
                role="progressbar"
                aria-valuenow={citizen.xp}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="XP to next level"
              >
                <div className="h-full bg-pipe" style={{ width: `${citizen.xp}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-bold text-ink">
                <span>{citizen.xp}/100 XP to Level {citizen.level + 1}</span>
                <span className="text-amber-800">Trophies: {citizen.clanTrophies} 🏆</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t-2 border-ink/20 pt-3">
            <div className="flex items-center justify-center gap-2 border-2 border-ink bg-white/90 p-2">
              <Coin size={20} spin={false} />
              <div className="text-left">
                <p className="font-pixel text-xs text-amber-700">{citizen.points}</p>
                <p className="text-[9px] font-bold uppercase text-ink/70">Coins</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 border-2 border-ink bg-white/90 p-2">
              <Sparkles className="size-5 text-emerald-600" />
              <div className="text-left">
                <p className="font-pixel text-xs text-emerald-700">{citizen.gems}</p>
                <p className="text-[9px] font-bold uppercase text-ink/70">Gems</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 border-2 border-ink bg-white/90 p-2">
              <Flame className="size-5 text-pink-600" />
              <div className="text-left">
                <p className="font-pixel text-xs text-pink-700">{citizen.elixir}</p>
                <p className="text-[9px] font-bold uppercase text-ink/70">Elixir</p>
              </div>
            </div>
          </div>
        </CCard>

        <div className="flex items-center justify-center gap-3">
          <QBlock label="?" />
          <QBlock label="$" />
          <QBlock label="!" />
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: '/citizen/report', label: 'Report issue', icon: Camera, cls: 'bg-mario text-white' },
          { href: '/citizen/rewards', label: 'Coin shop & Loot', icon: Gift, cls: 'bg-pipe text-white' },
          { href: '/citizen/leaderboard', label: 'Clan Wars & MVP', icon: Trophy, cls: 'bg-royal text-white' },
        ].map((a) => (
          <Link key={a.href} href={a.href} className={`pixel-box pixel-press flex items-center gap-4 p-5 ${a.cls}`}>
            <a.icon className="size-7" aria-hidden />
            <span className="font-pixel text-[10px] uppercase">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* My Reports */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-outline font-pixel text-sm uppercase text-white">My Active Quests & Reports ({mine.length})</h2>
          <PixelLink href="/citizen/complaints" variant="white" className="px-3 py-2 text-[8px]">
            See all
          </PixelLink>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mine.length === 0 ? (
            <div className="col-span-full border-[3px] border-dashed border-ink bg-white/90 p-8 text-center">
              <p className="font-pixel text-xs text-ink">No issues reported yet!</p>
              <p className="mt-2 text-sm text-ink/70">Spot a pothole or garbage dump? Report it and earn +40 Guardian Coins!</p>
              <Link href="/citizen/report" className="mt-4 inline-block pixel-box bg-mario px-4 py-2 font-pixel text-[9px] uppercase text-white">
                Start Quest
              </Link>
            </div>
          ) : (
            mine.slice(0, 3).map((c) => <ComplaintTile key={c.id} c={c} />)
          )}
        </div>
      </section>

      {/* Nearby Issues & Rulebook */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CCard title="Nearby issues - upvote to boost priority">
          <ul className="flex flex-col gap-3">
            {nearby.map((c) => (
              <li key={c.id}>
                <div className="flex items-center justify-between gap-3 border-2 border-ink bg-sand/60 px-3 py-2 hover:bg-coin">
                  <Link href={`/citizen/complaints/${c.id}`} className="text-sm font-bold text-ink hover:underline">
                    {c.title}
                  </Link>
                  <button
                    onClick={() => upvoteComplaint(c.id)}
                    className="flex items-center gap-1.5 border border-ink bg-white px-2 py-1 font-pixel text-[8px] hover:bg-coin"
                  >
                    👍 {c.upvotes}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </CCard>
        <CCard title="Points rulebook">
          <ul className="flex flex-col gap-2">
            {POINT_RULES.map((r) => (
              <li key={r.issue} className="flex items-center justify-between border-b border-ink/10 pb-2 text-sm">
                <span className="font-medium text-ink">{r.issue}</span>
                <span className="flex items-center gap-1.5 font-pixel text-[9px] text-amber-700">
                  <Coin size={12} spin={false} />+{r.points}
                </span>
              </li>
            ))}
          </ul>
        </CCard>
      </div>

      {/* Upcoming Events */}
      <CCard title="Upcoming clan drives & events">
        <ul className="grid gap-3 sm:grid-cols-2">
          {events.filter((e) => e.kind !== 'Notice').map((e) => (
            <li key={e.id} className="border-2 border-ink bg-sky-light/20 p-3 flex flex-col justify-between">
              <div>
                <p className="font-bold text-ink">{e.title}</p>
                <p className="text-xs text-ink/70 mt-1">
                  {new Date(e.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} - {e.place}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-pixel text-[8px] text-amber-700">+{e.points} pts</span>
                <Link href="/citizen/events" className="border border-ink bg-white px-2 py-1 font-pixel text-[8px] uppercase hover:bg-coin">
                  View & RSVP
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </CCard>
    </div>
  )
}
