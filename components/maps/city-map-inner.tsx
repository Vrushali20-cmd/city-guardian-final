'use client'

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix standard marker icon in Leaflet Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export type MapPoint = {
  id: string
  lat: number
  lng: number
  color: string
  radius?: number
  title: string
  detail?: string
}

// Raipur, Chhattisgarh City Center Coordinates
export const RAIPUR_CENTER: [number, number] = [21.2514, 81.6296]

function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export default function CityMapInner({
  points = [],
  center,
  zoom = 13,
  interactivePin,
  onLocationSelect,
}: {
  points?: MapPoint[]
  center?: [number, number]
  zoom?: number
  interactivePin?: [number, number] | null
  onLocationSelect?: (lat: number, lng: number) => void
}) {
  const mapCenter = center || (points.length > 0 ? [points[0].lat, points[0].lng] : RAIPUR_CENTER)

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ minHeight: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onLocationSelect={onLocationSelect} />

      {/* Render points */}
      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={p.radius ?? 12}
          pathOptions={{ color: '#14101f', weight: 3, fillColor: p.color, fillOpacity: 0.85 }}
        >
          <Popup>
            <div className="font-sans">
              <strong className="text-sm font-bold text-ink">{p.title}</strong>
              {p.detail && <div className="text-xs text-ink/75 mt-1">{p.detail}</div>}
              <div className="text-[10px] text-ink/50 mt-1">Raipur, Chhattisgarh</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Interactive Selected Location Pin */}
      {interactivePin && (
        <Marker position={interactivePin} icon={customIcon}>
          <Popup>
            <div className="font-sans text-xs">
              <strong>Selected Issue Location</strong>
              <div className="text-[10px] text-ink/70">
                Lat: {interactivePin[0].toFixed(5)}, Lng: {interactivePin[1].toFixed(5)}
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
