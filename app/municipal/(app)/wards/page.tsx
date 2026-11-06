import { WARDS } from '@/lib/data'
import { MPageHeader, MPanel } from '@/components/municipal/m-ui'
import { BlockBarChart } from '@/components/charts/pixel-charts'
import { CityMap } from '@/components/maps/city-map'

export const metadata = { title: 'Ward League | Command Castle' }

export default function WardsPage() {
  return (
    <div className="flex flex-col gap-8 text-ink">
      <MPageHeader title="Ward League" subtitle="Official ward names mapped to Clash Clan identities." />
      <MPanel title="Standings">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="font-pixel text-[8px] uppercase text-amber-800 bg-amber-50">
              <tr>
                {['Rank', 'Clan / Team', 'Official', 'Area', 'Resolved', 'Pending', 'Avg days', 'Points'].map((h) => (
                  <th key={h} className="border-b-2 border-ink px-3 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WARDS.map((w, i) => (
                <tr key={w.id} className="border-b border-ink/10 hover:bg-amber-50/50">
                  <td className="px-3 py-3 font-pixel text-[10px] text-amber-800 font-bold">{i + 1}</td>
                  <td className="px-3 py-3 font-bold text-ink">{w.game}</td>
                  <td className="px-3 py-3 font-medium">{w.official}</td>
                  <td className="px-3 py-3 text-ink/70">{w.area}</td>
                  <td className="px-3 py-3 font-bold text-pipe-dark">{w.resolved}</td>
                  <td className="px-3 py-3 font-bold text-mario">{w.pending}</td>
                  <td className="px-3 py-3">{w.avgDays}</td>
                  <td className="px-3 py-3 font-pixel text-[10px] font-bold text-ink">{w.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MPanel>
      <div className="grid gap-8 lg:grid-cols-2">
        <MPanel title="Points by ward">
          <BlockBarChart data={WARDS.map((w) => ({ name: w.official, points: w.points }))} dataKey="points" xKey="name" stroke="#14101f" />
        </MPanel>
        <MPanel title="Ward map">
          <CityMap
            className="h-60 w-full border-[3px] border-ink"
            points={WARDS.map((w) => ({ id: w.id, lat: w.lat, lng: w.lng, color: '#fbbf24', radius: 10 + w.points / 120, title: w.game, detail: `${w.official} - ${w.points} pts` }))}
          />
        </MPanel>
      </div>
    </div>
  )
}
