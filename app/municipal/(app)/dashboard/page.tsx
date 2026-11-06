import Link from 'next/link'
import { COMPLAINTS, TREND, WARDS, wardById } from '@/lib/data'
import { MPageHeader, MPanel, MStat } from '@/components/municipal/m-ui'
import { SeverityBadge, StatusBadge } from '@/components/mario/pixel-ui'
import { Countdown } from '@/components/mario/timers'
import { TrendChart } from '@/components/charts/pixel-charts'
import dynamic from 'next/dynamic'
import { RAIPUR_CENTER } from '@/components/maps/city-map'

const CityMap = dynamic(
  () => import('@/components/maps/city-map').then((mod) => mod.CityMap),
  { ssr: false }
)

const SEV_COLOR = { Low: '#2fa84f', Medium: '#fbbf24', High: '#f7931e', Critical: '#e52521' }

export default function MunicipalDashboard() {
  const pending = COMPLAINTS.filter((c) => ['reported', 'ai_analyzed'].includes(c.status))
  const active = COMPLAINTS.filter((c) => ['assigned', 'in_progress'].includes(c.status))
  const overdue = COMPLAINTS.filter((c) => new Date(c.deadline).getTime() < Date.now() && !['citizen_verified', 'rewarded'].includes(c.status))

  return (
    <div className="flex flex-col gap-8 text-ink">
      <MPageHeader title="Castle Command" subtitle="Raipur Municipal Corporation - Live Operations Overview" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MStat label="Total complaints" value={COMPLAINTS.length} />
        <MStat label="Awaiting verify" value={pending.length} tone="sky" />
        <MStat label="Active missions" value={active.length} tone="green" />
        <MStat label="Overdue" value={overdue.length} tone="red" />
        <MStat label="Avg fix (days)" value="3.1" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <MPanel title="Complaint heatmap" className="lg:col-span-2">
          <CityMap
            className="h-80 w-full border-[3px] border-ink"
            points={COMPLAINTS.map((c) => ({
              id: c.id,
              lat: c.lat,
              lng: c.lng,
              color: SEV_COLOR[c.severity],
              radius: 8 + c.upvotes / 6,
              title: `${c.id} - ${c.title}`,
              detail: `${c.severity} - ${wardById(c.wardId).official}`,
            }))}
          />
        </MPanel>
        <MPanel title="Live mission timers">
          <ul className="flex flex-col gap-3">
            {active.concat(overdue.filter((o) => !active.includes(o))).map((c) => (
              <li key={c.id} className="pixel-box-sm bg-amber-50/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[8px] text-ink/70">{c.id}</span>
                  <Countdown deadline={c.deadline} />
                </div>
                <p className="mt-2 text-sm font-bold text-ink">{c.title}</p>
                <p className="text-xs text-ink/70">{wardById(c.wardId).game}</p>
              </li>
            ))}
          </ul>
        </MPanel>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <MPanel title="Weekly trend" className="lg:col-span-2">
          <TrendChart
            data={TREND}
            stroke="#14101f"
            keys={[
              { key: 'reported', color: '#e52521', label: 'Reported' },
              { key: 'resolved', color: '#2fa84f', label: 'Resolved' },
            ]}
          />
        </MPanel>
        <MPanel title="Ward league">
          <ol className="flex flex-col gap-2">
            {WARDS.map((w, i) => (
              <li key={w.id} className="flex items-center gap-3 border-b border-ink/10 pb-2 text-sm">
                <span className="font-pixel text-[9px] text-amber-700 font-bold">{i + 1}</span>
                <span className="flex-1 font-semibold">{w.game}</span>
                <span className="font-pixel text-[9px] font-bold text-ink">{w.points}</span>
              </li>
            ))}
          </ol>
        </MPanel>
      </div>

      <MPanel
        title="Verification queue"
        action={
          <Link href="/municipal/complaints" className="font-pixel text-[8px] uppercase text-amber-800 underline">
            View all
          </Link>
        }
      >
        <ul className="divide-y divide-ink/10">
          {pending.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="font-pixel text-[8px] text-ink/70">{c.id}</span>
              <Link href={`/municipal/complaints/${c.id}`} className="flex-1 font-bold text-ink hover:text-mario">
                {c.title}
              </Link>
              <SeverityBadge severity={c.severity} />
              <StatusBadge status={c.status} />
            </li>
          ))}
        </ul>
      </MPanel>
    </div>
  )
}
