'use client'

import { useState } from 'react'
import { UserCheck, Users, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { TEAM_MEMBERS } from '@/lib/data'
import { useCityGuardian } from '@/lib/storage'

export function PlayerSwitcher() {
  const { citizen, updateCitizen } = useCityGuardian()
  const [open, setOpen] = useState(false)

  const handleSelectPlayer = (member: (typeof TEAM_MEMBERS)[0]) => {
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
    setOpen(false)
    toast.success(`Switched active player to: ${member.name} (${member.clan})`)
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="pixel-press flex items-center gap-1.5 border-2 border-ink bg-white px-2.5 py-1 font-pixel text-[8px] uppercase text-ink shadow-[2px_2px_0_0_#14101f] hover:bg-coin"
        title="Switch between the 13 Team Members / Players"
      >
        <Users className="size-3 text-mario" />
        <span className="font-bold truncate max-w-[110px] sm:max-w-none">{citizen.name}</span>
        <ChevronDown className="size-3 opacity-60" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-50 w-64 max-h-80 overflow-y-auto pixel-box bg-white p-1 text-ink shadow-[4px_4px_0_0_#14101f]">
            <div className="border-b-2 border-ink bg-amber-100 px-3 py-1.5 font-pixel text-[8px] uppercase font-bold text-amber-950">
              Select Team Member / Player (No Auth)
            </div>
            <ul className="divide-y divide-ink/10">
              {TEAM_MEMBERS.map((m) => {
                const isSelected = citizen.name === m.name
                return (
                  <li key={m.email}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlayer(m)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-amber-50 ${
                        isSelected ? 'bg-amber-100/80 font-bold' : ''
                      }`}
                    >
                      <div>
                        <p className="font-bold text-ink">{m.name}</p>
                        <p className="text-[10px] text-ink/70">
                          {m.clan} - {m.points} Coins
                        </p>
                      </div>
                      {isSelected && <UserCheck className="size-4 text-pipe-dark shrink-0" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

