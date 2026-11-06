'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const PALETTE = ['#e52521', '#fbbf24', '#2fa84f', '#5c94fc', '#6b2fa0', '#f7931e']
const tooltipStyle = { border: '3px solid #14101f', borderRadius: 0, fontFamily: 'var(--font-nunito)' }

export function TrendChart({
  data,
  keys,
  xKey = 'day',
  stroke = '#14101f',
}: {
  data: Record<string, string | number>[]
  keys: { key: string; color: string; label: string }[]
  xKey?: string
  stroke?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={stroke} strokeOpacity={0.15} strokeDasharray="4 4" />
        <XAxis dataKey={xKey} stroke={stroke} fontSize={12} />
        <YAxis stroke={stroke} fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k) => (
          <Line key={k.key} type="step" dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BlockBarChart({
  data,
  dataKey,
  xKey,
  stroke = '#14101f',
}: {
  data: Record<string, string | number>[]
  dataKey: string
  xKey: string
  stroke?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={stroke} strokeOpacity={0.15} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={xKey} stroke={stroke} fontSize={11} />
        <YAxis stroke={stroke} fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(251,191,36,0.2)' }} />
        <Bar dataKey={dataKey} stroke="#14101f" strokeWidth={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} stroke="#14101f" strokeWidth={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
