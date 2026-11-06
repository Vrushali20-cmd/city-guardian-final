'use client'

import dynamic from 'next/dynamic'
import type { MapPoint } from './city-map-inner'
import { RAIPUR_CENTER } from './city-map-inner'

const Inner = dynamic(() => import('./city-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-sand font-pixel text-[9px] uppercase">
      Loading Raipur OpenStreetMap...
    </div>
  ),
})

export type { MapPoint }
export { RAIPUR_CENTER }

export function CityMap({
  points,
  zoom,
  center,
  className,
  interactivePin,
  onLocationSelect,
}: {
  points?: MapPoint[]
  zoom?: number
  center?: [number, number]
  className?: string
  interactivePin?: [number, number] | null
  onLocationSelect?: (lat: number, lng: number) => void
}) {
  return (
    <div className={className ?? 'h-80 w-full'}>
      <Inner
        points={points}
        zoom={zoom}
        center={center}
        interactivePin={interactivePin}
        onLocationSelect={onLocationSelect}
      />
    </div>
  )
}
