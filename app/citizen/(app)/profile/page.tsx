'use client'

import { useState } from 'react'
import { Shield, Sparkles, Flame, User, Mail, MapPin, Award, CheckCircle, Copy, Users, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { TEAM_MEMBERS, WARDS } from '@/lib/data'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin, PixelButton } from '@/components/mario/pixel-ui'
import { GuardianHero } from '@/components/mario/sprites'

const AVATARS = [
  { id: 'mario', name: 'Super Mario', icon: '🍄' },
  { id: 'luigi', name: 'Luigi Guardian', icon: '⭐' },
  { id: 'peach', name: 'Princess Peach', icon: '👑' },
  { id: 'barbarian', name: 'Barbarian King', icon: '⚔️' },
  { id: 'archer', name: 'Archer Queen', icon: '🏹' },
  { id: 'builder', name: 'Master Builder', icon: '🔨' },
]

export default function CitizenProfilePage() {
  const { citizen, updateCitizen } = useCityGuardian()

  const [name, setName] = useState(citizen.name)
  const [email, setEmail] = useState(citizen.email)
  const [ward, setWard] = useState(citizen.ward)
  const [zone, setZone] = useState(citizen.zone)
  const [avatar, setAvatar] = useState(citizen.avatar || 'mario')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const targetWard = WARDS.find((w) => w.official === ward)
    const clanName = targetWard ? targetWard.game : citizen.clan

    updateCitizen({
      name,
      email,
      ward,
      zone,
      avatar,
      clan: clanName,
    })
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } })
    toast.success('Guardian profile & Clan registration updated!')
  }

  const handleQuickSwitch = (member: (typeof TEAM_MEMBERS)[0]) => {
    setName(member.name)
    setEmail(member.email)
    setWard(member.ward)
    setZone(member.zone)
    setAvatar(member.avatar)

    updateCitizen({
      name: member.name,
      email: member.email,
      ward: member.ward,
      zone: member.zone,
      points: member.points,
      gems: member.gems,
      elixir: member.elixir,
      clan: member.clan,
      clanRole: member.clanRole,
      clanTrophies: member.clanTrophies,
      townHallLevel: member.townHallLevel,
      level: member.level,
      xp: member.xp,
      avatar: member.avatar,
      title: member.title,
      badges: ['First Report', 'Raipur Guardian', 'Night Watch', member.badge],
    })
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } })
    toast.success(`Switched active player to: ${member.name} (${member.clan})`)
  }

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    toast.success(`Copied voucher code: ${code}`)
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Raipur Guardian Profile & Clan Hall"
        subtitle="Manage your player identity, switch team members instantly, and view redeemed loot vouchers."
      />

      {/* Hero Badge Banner */}
      <CCard className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="grid size-20 place-items-center border-[3px] border-ink bg-white shadow-[3px_3px_0_0_#14101f]">
              <GuardianHero size={4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] bg-ink text-coin px-2 py-0.5">
                  Town Hall Lvl {citizen.townHallLevel}
                </span>
                <span className="font-pixel text-[8px] bg-pipe text-white px-2 py-0.5">
                  Guardian Lvl {citizen.level}
                </span>
              </div>
              <h1 className="mt-1 font-pixel text-lg text-ink uppercase">{citizen.name}</h1>
              <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mt-0.5">
                <Shield className="size-3.5 text-blue-700" />
                <span>{citizen.clan} ({citizen.ward}) - {citizen.clanRole}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center border-2 border-ink bg-white/95 px-3 py-2 text-center shadow-[2px_2px_0_0_#14101f]">
              <Coin size={18} spin={false} />
              <span className="font-pixel text-xs text-amber-700 font-bold mt-1">{citizen.points}</span>
              <span className="text-[8px] uppercase font-bold text-ink/70">Coins</span>
            </div>
            <div className="flex flex-col items-center border-2 border-ink bg-white/95 px-3 py-2 text-center shadow-[2px_2px_0_0_#14101f]">
              <Sparkles className="size-5 text-emerald-600" />
              <span className="font-pixel text-xs text-emerald-700 font-bold mt-1">{citizen.gems}</span>
              <span className="text-[8px] uppercase font-bold text-ink/70">Gems</span>
            </div>
            <div className="flex flex-col items-center border-2 border-ink bg-white/95 px-3 py-2 text-center shadow-[2px_2px_0_0_#14101f]">
              <Flame className="size-5 text-pink-600" />
              <span className="font-pixel text-xs text-pink-700 font-bold mt-1">{citizen.elixir}</span>
              <span className="text-[8px] uppercase font-bold text-ink/70">Elixir</span>
            </div>
          </div>
        </div>
      </CCard>

      {/* 13 Team Members Quick Selector */}
      <CCard title="Team Members / Dummy Player Switcher (No Auth Needed)" className="border-3 border-amber-500 bg-amber-50/60">
        <p className="text-xs text-ink/75 mb-4">
          Click any team member below to instantly take their player identity, view their Raipur reports, and spend their coins:
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {TEAM_MEMBERS.map((m) => {
            const isCurrent = citizen.name === m.name
            return (
              <button
                type="button"
                key={m.name}
                onClick={() => handleQuickSwitch(m)}
                className={`pixel-press flex flex-col justify-between border-2 p-2.5 text-left transition-all ${
                  isCurrent
                    ? 'border-ink bg-amber-300 shadow-[3px_3px_0_0_#14101f]'
                    : 'border-ink/20 bg-white hover:bg-amber-100 hover:border-ink'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-ink truncate">{m.name}</span>
                  {isCurrent && <UserCheck className="size-3.5 text-pipe-dark shrink-0" />}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-ink/70">
                  <span>{m.clan}</span>
                  <span className="font-pixel font-bold text-amber-900">{m.points}🪙</span>
                </div>
              </button>
            )
          })}
        </div>
      </CCard>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CCard title="Active Player Credentials & Clan Setup">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Avatar Selector */}
              <div>
                <label className="font-pixel text-[9px] uppercase text-ink flex items-center gap-2 mb-2 font-bold">
                  Choose Hero Avatar
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setAvatar(av.id)}
                      className={`pixel-press flex flex-col items-center border-2 p-2 text-center transition-all ${
                        avatar === av.id
                          ? 'border-ink bg-amber-300 shadow-[2px_2px_0_0_#14101f]'
                          : 'border-ink/30 bg-cream/50 hover:bg-amber-100'
                      }`}
                    >
                      <span className="text-xl">{av.icon}</span>
                      <span className="text-[8px] font-bold mt-1 truncate w-full">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm font-bold text-ink">
                  <span className="font-pixel text-[8px] uppercase">Full Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-[3px] border-ink bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-coin"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-bold text-ink">
                  <span className="font-pixel text-[8px] uppercase">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[3px] border-ink bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-coin"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-bold text-ink">
                  <span className="font-pixel text-[8px] uppercase">Raipur Ward</span>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="border-[3px] border-ink bg-white p-2 text-sm outline-none"
                  >
                    {WARDS.map((w) => (
                      <option key={w.id} value={w.official}>
                        {w.official} - {w.game} ({w.area})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-sm font-bold text-ink">
                  <span className="font-pixel text-[8px] uppercase">Raipur Zone</span>
                  <input
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="border-[3px] border-ink bg-white p-2 text-sm outline-none"
                  />
                </label>
              </div>

              <PixelButton type="submit" variant="yellow" className="mt-2 w-fit">
                Save Player Changes
              </PixelButton>
            </form>
          </CCard>

          {/* Unlocked Badges */}
          <CCard title="Unlocked Badges & Achievements">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'First Report', desc: 'Filed your first city complaint', icon: '🏅' },
                { title: 'Raipur Guardian', desc: 'Protecting Raipur streets and parks', icon: '🌴' },
                { title: 'Pothole Hunter', desc: 'Resolved road hazards on GE Road', icon: '🚧' },
                { title: 'Night Watch', desc: 'Reported streetlight outages in Shankar Nagar', icon: '💡' },
                { title: 'Marine Drive Hero', desc: 'Attended Telibandha lake cleanup drive', icon: '🌊' },
                { title: 'Clan Champion', desc: 'Represented your ward in Raipur War League', icon: '⚔️' },
              ].map((b) => (
                <div key={b.title} className="flex items-center gap-3 border-2 border-ink bg-amber-50/60 p-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-pixel text-[8px] uppercase font-bold text-amber-900">{b.title}</p>
                    <p className="text-xs text-ink/75">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CCard>
        </div>

        {/* Sidebar: Redeemed Loot Inventory */}
        <div className="flex flex-col gap-6">
          <CCard title="My Active Loot Vouchers">
            {(!citizen.redeemedCoupons || citizen.redeemedCoupons.length === 0) ? (
              <p className="text-xs text-ink/60">No vouchers redeemed yet. Visit the Coin Shop!</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {citizen.redeemedCoupons.map((v) => (
                  <li key={v.id} className="border-2 border-ink bg-white p-3 shadow-[2px_2px_0_0_#14101f]">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[8px] uppercase text-amber-800 font-bold">{v.partner}</span>
                      <span className="border border-ink bg-pipe px-1.5 py-0.5 font-pixel text-[7px] text-white">
                        {v.status}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-sm text-ink">{v.title}</p>
                    <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2">
                      <span className="font-pixel text-[9px] text-amber-900 select-all font-bold">{v.code}</span>
                      <button
                        onClick={() => copyCode(v.code)}
                        className="flex items-center gap-1 border border-ink bg-amber-100 px-2 py-0.5 text-[10px] font-bold hover:bg-amber-200"
                      >
                        <Copy className="size-3" /> Copy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CCard>

          <CCard title="Raipur Clan Chest Statistics" className="bg-amber-50">
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between border-b border-ink/10 pb-1.5">
                <span className="text-ink/70">Town Hall Level:</span>
                <span className="font-bold">TH {citizen.townHallLevel}</span>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-1.5">
                <span className="text-ink/70">Clan Trophies:</span>
                <span className="font-bold text-amber-800">{citizen.clanTrophies} 🏆</span>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-1.5">
                <span className="text-ink/70">Total XP:</span>
                <span className="font-bold">{citizen.xp}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Raipur Clan Rank:</span>
                <span className="font-bold text-pipe-dark">#1 in {citizen.ward}</span>
              </div>
            </dl>
          </CCard>
        </div>
      </div>
    </div>
  )
}
