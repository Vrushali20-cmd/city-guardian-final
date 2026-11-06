'use client'

import { useState } from 'react'
import { Trophy, Shield, Award, Users, Flame, Star, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { CITIZENS } from '@/lib/data'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin } from '@/components/mario/pixel-ui'

export default function LeaderboardPage() {
  const { citizen, wards, updateCitizen } = useCityGuardian()
  const [activeTab, setActiveTab] = useState<'wards' | 'citizens'>('wards')

  // Sorted wards by points descending
  const sortedWards = [...wards].sort((a, b) => b.points - a.points)

  // Merge current citizen into citizens list
  const allCitizens = [
    {
      name: citizen.name,
      ward: citizen.ward,
      points: citizen.points,
      reports: 14,
      badge: 'Gold Guardian',
      isMe: true,
    },
    ...CITIZENS.filter((c) => c.name !== citizen.name).map((c) => ({ ...c, isMe: false })),
  ].sort((a, b) => b.points - a.points)

  const handleJoinClan = (wardOfficial: string, clanName: string) => {
    updateCitizen({ ward: wardOfficial, clan: clanName })
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
    toast.success(`Joined ${clanName}! You now fight for ${wardOfficial}.`)
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Clan Wars & Guardian Leaderboard"
        subtitle="Compete with rival wards and top city guardians for glory, trophies, and seasonal rewards!"
      />

      {/* Season Banner */}
      <CCard className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center border-[3px] border-ink bg-coin shadow-[2px_2px_0_0_#14101f]">
              <Trophy className="size-8 text-ink" />
            </div>
            <div>
              <span className="font-pixel text-[8px] uppercase font-bold text-amber-950">Clan War Season 4</span>
              <h2 className="font-pixel text-lg text-ink">Raipur Swachhata Championship</h2>
              <p className="mt-1 text-xs text-ink/80">Season ends in 4 days - Winning Raipur clan earns +500 Coins per member!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-2 border-ink bg-white/95 px-4 py-2 font-pixel text-xs">
            <span className="text-amber-800">Your Clan:</span>
            <span className="font-bold text-mario">{citizen.clan}</span>
          </div>
        </div>
      </CCard>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-ink pb-2">
        <button
          onClick={() => setActiveTab('wards')}
          className={`pixel-press flex items-center gap-2 border-[3px] border-ink px-5 py-2 font-pixel text-[9px] uppercase shadow-[3px_3px_0_0_#14101f] ${
            activeTab === 'wards' ? 'bg-amber-400 font-bold text-ink' : 'bg-white text-ink hover:bg-amber-100'
          }`}
        >
          <Shield className="size-4" />
          <span>Ward Clan League ({wards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('citizens')}
          className={`pixel-press flex items-center gap-2 border-[3px] border-ink px-5 py-2 font-pixel text-[9px] uppercase shadow-[3px_3px_0_0_#14101f] ${
            activeTab === 'citizens' ? 'bg-amber-400 font-bold text-ink' : 'bg-white text-ink hover:bg-amber-100'
          }`}
        >
          <Users className="size-4" />
          <span>Guardian Hall of Fame</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'wards' ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {sortedWards.slice(0, 3).map((w, index) => {
              const medals = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place']
              const borders = ['border-amber-500 bg-amber-50', 'border-slate-400 bg-slate-50', 'border-amber-700 bg-orange-50']
              return (
                <div key={w.id} className={`pixel-box border-4 p-5 text-center ${borders[index]}`}>
                  <span className="font-pixel text-[9px] font-bold uppercase">{medals[index]}</span>
                  <h3 className="mt-2 font-pixel text-sm text-ink">{w.game}</h3>
                  <p className="text-xs text-ink/70 font-semibold">{w.official} - {w.area}</p>
                  <p className="mt-3 font-pixel text-lg text-amber-900 font-bold">{w.points} pts</p>
                  <div className="mt-2 flex justify-center gap-3 text-xs text-ink/75">
                    <span>✅ {w.resolved} resolved</span>
                    <span>⏱️ {w.avgDays}d avg</span>
                  </div>
                </div>
              )
            })}
          </div>

          <CCard title="Full Ward League Standings">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-amber-100/70 font-pixel text-[8px] uppercase text-amber-950">
                  <tr>
                    {['Rank', 'Clan Name', 'Official Ward', 'Area', 'Resolved Quests', 'Pending', 'Clan Points', 'Action'].map((h) => (
                      <th key={h} className="border-b-2 border-ink px-3 py-3 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedWards.map((w, i) => {
                    const isMyClan = citizen.clan === w.game
                    return (
                      <tr
                        key={w.id}
                        className={`border-b border-ink/10 transition-colors ${
                          isMyClan ? 'bg-amber-100 font-bold' : 'hover:bg-amber-50/50'
                        }`}
                      >
                        <td className="px-3 py-3 font-pixel text-[10px] text-amber-900 font-bold">
                          #{i + 1}
                        </td>
                        <td className="px-3 py-3 font-bold text-ink flex items-center gap-2">
                          <Shield className="size-4 text-blue-600" />
                          <span>{w.game}</span>
                          {isMyClan && (
                            <span className="border border-ink bg-mario px-1.5 py-0.5 font-pixel text-[7px] text-white">
                              Your Clan
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-medium">{w.official}</td>
                        <td className="px-3 py-3 text-ink/70">{w.area}</td>
                        <td className="px-3 py-3 font-bold text-pipe-dark">{w.resolved}</td>
                        <td className="px-3 py-3 font-bold text-mario">{w.pending}</td>
                        <td className="px-3 py-3 font-pixel text-[10px] text-amber-900 font-bold">{w.points}</td>
                        <td className="px-3 py-3">
                          {isMyClan ? (
                            <span className="flex items-center gap-1 font-pixel text-[8px] text-pipe-dark">
                              <CheckCircle className="size-3.5" /> Enlisted
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleJoinClan(w.official, w.game)}
                              className="border border-ink bg-white px-2.5 py-1 font-pixel text-[7px] uppercase hover:bg-amber-300"
                            >
                              Join Clan
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CCard>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <CCard title="Individual Guardian Hall of Fame">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-amber-100/70 font-pixel text-[8px] uppercase text-amber-950">
                  <tr>
                    {['Rank', 'Player Name', 'Ward Affiliation', 'Reports Filed', 'Title Badge', 'Guardian Coins'].map((h) => (
                      <th key={h} className="border-b-2 border-ink px-3 py-3 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allCitizens.map((c, i) => (
                    <tr
                      key={c.name}
                      className={`border-b border-ink/10 ${
                        c.isMe ? 'bg-amber-100 font-bold' : 'hover:bg-amber-50/50'
                      }`}
                    >
                      <td className="px-3 py-3 font-pixel text-[10px] text-amber-900 font-bold">
                        {i === 0 ? '👑 1' : i === 1 ? '🥈 2' : i === 2 ? '🥉 3' : `#${i + 1}`}
                      </td>
                      <td className="px-3 py-3 font-bold text-ink">
                        {c.name} {c.isMe && <span className="ml-2 font-pixel text-[7px] text-mario">(YOU)</span>}
                      </td>
                      <td className="px-3 py-3 text-ink/80">{c.ward}</td>
                      <td className="px-3 py-3 font-semibold">{c.reports} quests</td>
                      <td className="px-3 py-3">
                        <span className="border border-ink bg-white px-2 py-0.5 font-pixel text-[7px] uppercase">
                          {c.badge}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-pixel text-[10px] text-amber-800 font-bold">
                        <span className="inline-flex items-center gap-1.5">
                          <Coin size={12} spin={false} /> {c.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CCard>
        </div>
      )}
    </div>
  )
}

