import { CloudRain, Thermometer, Wind } from 'lucide-react'
import { ZONES, aqiLevel } from '@/lib/data'
import { MPageHeader, MPanel } from '@/components/municipal/m-ui'
import { CityMap } from '@/components/maps/city-map'

export const metadata = { title: 'AQI & Weather | Command Castle' }

export default function WeatherPage() {
  return (
    <div className="flex flex-col gap-8 text-ink">
      <MPageHeader title="AQI & Weather Zones" subtitle="Zone-wise air quality and weather. Prioritise drives in high AQI areas." />
      <MPanel title="Zone AQI map">
        <CityMap
          className="h-96 w-full border-[3px] border-ink"
          points={ZONES.map((z) => ({
            id: z.id,
            lat: z.lat,
            lng: z.lng,
            color: aqiLevel(z.aqi).color,
            radius: 14 + z.aqi / 10,
            title: z.name,
            detail: `AQI ${z.aqi} - ${aqiLevel(z.aqi).label} - ${z.temp}°C`,
          }))}
        />
      </MPanel>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {ZONES.map((z) => {
          const lvl = aqiLevel(z.aqi)
          return (
            <li key={z.id} className="pixel-box bg-white p-4">
              <p className="text-sm font-bold text-ink">{z.name}</p>
              <p className="mt-3 font-pixel text-xl font-bold" style={{ color: lvl.color }}>{z.aqi}</p>
              <p className="text-xs font-semibold" style={{ color: lvl.color }}>{lvl.label}</p>
              <div className="mt-3 flex flex-col gap-1 text-xs text-ink/75">
                <span className="flex items-center gap-1.5"><Thermometer className="size-3.5" aria-hidden />{z.temp}°C</span>
                <span className="flex items-center gap-1.5"><Wind className="size-3.5" aria-hidden />12 km/h NW</span>
                <span className="flex items-center gap-1.5"><CloudRain className="size-3.5" aria-hidden />20% rain</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
