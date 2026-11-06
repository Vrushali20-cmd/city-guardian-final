import { CATEGORY_SPLIT, TREND, WARDS } from '@/lib/data'
import { MPageHeader, MPanel, MStat } from '@/components/municipal/m-ui'
import { BlockBarChart, DonutChart, TrendChart } from '@/components/charts/pixel-charts'

export const metadata = { title: 'Analytics | Command Castle' }

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 text-ink">
      <MPageHeader title="City Analytics" subtitle="Resolution speed, category mix and ward performance." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MStat label="Resolution rate" value="82%" tone="green" />
        <MStat label="SLA breaches" value="7" tone="red" />
        <MStat label="Citizen satisfaction" value="4.3" />
        <MStat label="Coins issued" value="12.4k" tone="sky" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <MPanel title="Reported vs resolved">
          <TrendChart data={TREND} stroke="#14101f" keys={[{ key: 'reported', color: '#e52521', label: 'Reported' }, { key: 'resolved', color: '#2fa84f', label: 'Resolved' }]} />
        </MPanel>
        <MPanel title="Category split">
          <DonutChart data={CATEGORY_SPLIT} />
        </MPanel>
        <MPanel title="Pending by ward" className="lg:col-span-2">
          <BlockBarChart data={WARDS.map((w) => ({ name: w.game, pending: w.pending }))} dataKey="pending" xKey="name" stroke="#14101f" />
        </MPanel>
      </div>
    </div>
  )
}
