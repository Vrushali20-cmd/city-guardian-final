import { Crown, Gift, Recycle, ShieldCheck, Trophy } from 'lucide-react'
import { CITIZENS, COMPLAINTS, PARTNERS, WARDS } from '@/lib/data'
import { Coin, PixelCard, StatTile } from '@/components/mario/pixel-ui'

const LOOPS = [
  {
    title: 'Ward accountability',
    Icon: ShieldCheck,
    color: 'bg-night text-white',
    steps: ['Complaint verified', 'Mission timer starts', 'Fix + proof uploaded', 'Ward earns league points'],
  },
  {
    title: 'Citizen engagement',
    Icon: Recycle,
    color: 'bg-sky text-white',
    steps: ['Report an issue', 'AI analysis + tracking', 'Confirm the fix', 'Earn Guardian Coins'],
  },
  {
    title: 'Partner rewards',
    Icon: Gift,
    color: 'bg-royal text-white',
    steps: ['Partner adds coupons', 'Citizens redeem coins', 'Partner verifies code', 'CSR rank climbs'],
  },
]

export function ThreeLoops() {
  return (
    <section id="loops" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
      <h2 className="pixel-text-shadow text-center font-pixel text-xl text-white md:text-2xl">Three game loops</h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {LOOPS.map((l) => (
          <div key={l.title} className={`pixel-box p-6 ${l.color}`}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center border-[3px] border-ink bg-coin text-ink">
                <l.Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-pixel text-[10px] uppercase leading-relaxed">{l.title}</h3>
            </div>
            <ol className="mt-5 flex flex-col gap-3">
              {l.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center border-2 border-ink bg-white font-pixel text-[8px] text-ink">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Leaderboards() {
  const fixed = COMPLAINTS.filter((c) => ['resolved', 'inspection_verified', 'citizen_verified', 'rewarded'].includes(c.status)).length
  return (
    <section id="leaderboard" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Issues reported" value={COMPLAINTS.length * 3} />
        <StatTile label="Issues fixed" value={fixed * 2 + 1} />
        <StatTile label="Guardians" value={CITIZENS.length + 3} />
        <StatTile label="Partners" value={PARTNERS.filter((p) => p.status === 'verified').length} />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <PixelCard className="p-6">
          <h3 className="flex items-center gap-2 font-pixel text-[11px] uppercase">
            <Trophy className="size-4 text-coin-dark" aria-hidden /> Ward league
          </h3>
          <ol className="mt-5 flex flex-col gap-3">
            {WARDS.map((w, i) => (
              <li key={w.id} className="flex items-center gap-4 bg-sand px-4 py-3">
                <span className={`grid size-7 place-items-center border-2 border-ink font-pixel text-[9px] ${i === 0 ? 'bg-coin' : 'bg-white'}`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="font-bold">{w.game}</div>
                  <div className="text-xs text-muted-foreground">
                    {w.official} - {w.area}
                  </div>
                </div>
                <span className="font-pixel text-[10px] text-mario">{w.points}</span>
              </li>
            ))}
          </ol>
        </PixelCard>

        <PixelCard className="p-6">
          <h3 className="flex items-center gap-2 font-pixel text-[11px] uppercase">
            <Crown className="size-4 text-mario" aria-hidden /> Top guardians
          </h3>
          <ol className="mt-5 flex flex-col gap-3">
            {CITIZENS.slice(0, 5).map((c, i) => (
              <li key={c.name} className="flex items-center gap-4 bg-sand px-4 py-3">
                <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-sky font-bold text-white">
                  {c.name[0]}
                </span>
                <span className="flex-1 font-bold">{c.name}</span>
                <span className="flex items-center gap-1.5 font-pixel text-[10px]">
                  <Coin size={14} spin={false} /> {c.points}
                </span>
                {i === 0 && <Crown className="size-4 text-coin-dark" aria-label="Top guardian" />}
              </li>
            ))}
          </ol>
        </PixelCard>
      </div>
    </section>
  )
}
