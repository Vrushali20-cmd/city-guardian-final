'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera, Sparkles, UploadCloud, CheckCircle2, Loader2, MapPin, Navigation } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { WARDS, type Severity } from '@/lib/data'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin, PixelButton } from '@/components/mario/pixel-ui'
import dynamic from 'next/dynamic'
import { RAIPUR_CENTER } from '@/components/maps/city-map'

const CityMap = dynamic(
  () => import('@/components/maps/city-map').then((mod) => mod.CityMap),
  { ssr: false }
)

const CATEGORIES = [
  { id: 'Road Damage', label: 'Road Damage', icon: '🚧', severity: 'Critical' as Severity, defaultImg: '/images/pothole.png' },
  { id: 'Garbage', label: 'Garbage', icon: '🗑️', severity: 'High' as Severity, defaultImg: '/images/garbage.png' },
  { id: 'Drainage', label: 'Drainage Overflow', icon: '🌊', severity: 'High' as Severity, defaultImg: '/images/drainage.png' },
  { id: 'Streetlight', label: 'Broken Streetlight', icon: '💡', severity: 'Medium' as Severity, defaultImg: '/images/streetlight.png' },
  { id: 'Water Leakage', label: 'Water Leakage', icon: '💧', severity: 'Critical' as Severity, defaultImg: '/images/drainage.png' },
  { id: 'Illegal Dumping', label: 'Illegal Dumping', icon: '🛑', severity: 'Medium' as Severity, defaultImg: '/images/garbage.png' },
]

export default function ReportPage() {
  const router = useRouter()
  const { citizen, addComplaint } = useCityGuardian()

  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [wardId, setWardId] = useState(WARDS[0].id)
  const [location, setLocation] = useState('Telibandha Marine Drive, Raipur')
  const [lat, setLat] = useState<number>(RAIPUR_CENTER[0])
  const [lng, setLng] = useState<number>(RAIPUR_CENTER[1])
  const [detectingGps, setDetectingGps] = useState(false)
  const [selectedImage, setSelectedImage] = useState(CATEGORIES[0].defaultImg)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [isCustomUpload, setIsCustomUpload] = useState(false)

  const currentCat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0]

  const handleCategorySelect = (catId: string) => {
    setCategory(catId)
    if (!isCustomUpload) {
      const match = CATEGORIES.find((c) => c.id === catId)
      if (match) {
        setSelectedImage(match.defaultImg)
      }
    }
  }

  // Live GPS Location Detection
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }

    setDetectingGps(true)
    const toastId = toast.loading('Acquiring live GPS satellite coordinates...')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        setLat(latitude)
        setLng(longitude)

        // Reverse Geocode with OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'CityGuardian-Raipur-App/1.0' } },
          )
          const data = await res.json()
          if (data && data.display_name) {
            // Extract short readable landmark
            const parts = data.display_name.split(',')
            const shortName = parts.slice(0, 3).join(',').trim()
            setLocation(shortName)
          } else {
            setLocation(`GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Raipur`)
          }
        } catch {
          setLocation(`GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Raipur`)
        }

        setDetectingGps(false)
        toast.success(`📍 Live GPS Locked! Accuracy: ±${Math.round(accuracy)}m`, { id: toastId })
      },
      (err) => {
        setDetectingGps(false)
        console.warn('Geolocation error:', err)
        toast.info('GPS permission denied or timeout. Using Raipur city center.', { id: toastId })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  // Interactive OpenStreetMap Click Handler
  const handleMapLocationSelect = (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
    setLocation(`Pinned: ${newLat.toFixed(4)}°N, ${newLng.toFixed(4)}°E (Raipur)`)
    toast.info(`Pin updated on Raipur OpenStreetMap: ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`)
  }

  // Upload photo to server `/api/upload`
  const handleCustomFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    const toastId = toast.loading('Uploading photo to server...')

    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (json.success && json.url) {
        setSelectedImage(json.url)
        setIsCustomUpload(true)
        toast.success('Photo uploaded successfully! Ready for submission.', { id: toastId })
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedImage(reader.result as string)
          setIsCustomUpload(true)
          toast.success('Photo ready!', { id: toastId })
        }
        reader.readAsDataURL(file)
      }
    } catch {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setIsCustomUpload(true)
        toast.success('Photo ready!', { id: toastId })
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !location.trim()) {
      toast.error('Please enter a title and location for the issue!')
      return
    }

    setIsSubmitting(true)
    const newId = `CG-${Math.floor(1050 + Math.random() * 900)}`
    const selectedWard = WARDS.find((w) => w.id === wardId) || WARDS[0]

    const newComplaint = {
      id: newId,
      title,
      category: category as any,
      severity: currentCat.severity,
      status: 'reported' as const,
      wardId,
      image: selectedImage,
      location,
      lat,
      lng,
      reportedBy: citizen.name || 'Anurag Tiwari',
      reportedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      upvotes: 1,
      description: description || `Reported by ${citizen.name} in Raipur ${selectedWard.official}.`,
      ai: {
        confidence: 94,
        approach: 'Dispatch Raipur Nagar Nigam mobile response squad.',
        effort: '1 repair truck, 3 workers',
        timeline: '1-3 days',
        similar: `Resolved in ${selectedWard.game} in under 48 hours.`,
      },
    }

    try {
      await addComplaint(newComplaint)
      setIsSubmitting(false)
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } })
      toast.success(`🎉 Quest Launched & Saved to MongoDB! +40 Guardian Coins awarded!`, {
        description: `Complaint ${newId} logged at (${lat.toFixed(4)}, ${lng.toFixed(4)}) Raipur.`,
      })
      router.push(`/citizen/complaints/${newId}`)
    } catch {
      setIsSubmitting(false)
      toast.error('Failed to submit complaint. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Report City Issue - Raipur"
        subtitle="Detect your live GPS position, drop an OpenStreetMap pin & earn +40 Guardian Coins!"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Report Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="pixel-box flex flex-col gap-6 bg-white p-6">
            {/* Category Grid */}
            <div>
              <label className="font-pixel text-[10px] uppercase text-ink flex items-center gap-2 font-bold">
                1. Select Issue Type
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((c) => {
                  const active = category === c.id
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleCategorySelect(c.id)}
                      className={`pixel-press flex flex-col items-center gap-1.5 border-[3px] p-3 text-center transition-all ${active
                          ? 'border-ink bg-amber-300 shadow-[3px_3px_0_0_#14101f]'
                          : 'border-ink/30 bg-cream/50 hover:bg-amber-100 hover:border-ink'
                        }`}
                    >
                      <span className="text-2xl">{c.icon}</span>
                      <span className="font-pixel text-[8px] uppercase font-bold text-ink">{c.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Photo Upload & Presets */}
            <div>
              <label className="font-pixel text-[10px] uppercase text-ink flex items-center gap-2 font-bold">
                <Camera className="size-4" /> 2. Photo Evidence (Upload Custom or Use Preset)
              </label>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-video overflow-hidden border-[3px] border-ink bg-sand/30">
                  <Image src={selectedImage} alt="Selected preview" fill sizes="400px" className="object-cover" />
                  <span className="absolute bottom-2 left-2 border border-ink bg-white/95 px-2 py-0.5 font-pixel text-[7px] uppercase font-bold">
                    {isCustomUpload ? '📷 Custom Upload' : 'Preset Preview'}
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-3">
                  <p className="text-xs text-ink/75 font-medium">
                    Upload an actual photo from your device (saved to MongoDB & server) or choose a preset:
                  </p>
                  <label className="pixel-press flex cursor-pointer items-center justify-center gap-2 border-[2px] border-dashed border-ink bg-amber-50 p-3 font-pixel text-[8px] uppercase hover:bg-amber-200">
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Uploading Photo...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="size-4 text-ink" />
                        <span>Upload Custom Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingPhoto}
                      onChange={handleCustomFile}
                      className="hidden"
                    />
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => {
                          setSelectedImage(cat.defaultImg)
                          setIsCustomUpload(false)
                        }}
                        className="border border-ink bg-white px-2 py-1 text-[10px] font-medium hover:bg-coin"
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live GPS & OpenStreetMap Raipur Location */}
            <div className="border-2 border-ink bg-amber-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink/20 pb-2">
                <label className="font-pixel text-[10px] uppercase text-ink flex items-center gap-2 font-bold">
                  <MapPin className="size-4 text-mario" />
                  <span>3. Raipur OpenStreetMap Location</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectLiveLocation}
                  disabled={detectingGps}
                  className="pixel-press flex items-center gap-1.5 border-2 border-ink bg-pipe px-3 py-1 font-pixel text-[8px] uppercase text-white shadow-[2px_2px_0_0_#14101f] hover:bg-pipe-dark disabled:opacity-50"
                >
                  {detectingGps ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Navigation className="size-3" />
                  )}
                  <span>Detect My Live GPS</span>
                </button>
              </div>

              <p className="mt-2 text-xs text-ink/75">
                Click anywhere on the Raipur OpenStreetMap to pinpoint the exact location or use the button above to auto-detect your live GPS coordinates:
              </p>

              {/* Interactive OpenStreetMap Container */}
              <div className="mt-3 overflow-hidden border-[3px] border-ink bg-white">
                <CityMap
                  center={[lat, lng]}
                  zoom={14}
                  className="h-64 w-full"
                  interactivePin={[lat, lng]}
                  onLocationSelect={handleMapLocationSelect}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-ink">
                <span>Coordinates: <strong className="font-mono text-amber-900">{lat.toFixed(5)}° N, {lng.toFixed(5)}° E</strong></span>
                <span className="text-[10px] bg-white border border-ink px-2 py-0.5">Raipur City Map</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">
                <span className="font-pixel text-[9px] uppercase">4. Issue Title *</span>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hazardous pothole near Jaistambh Chowk flyover"
                  className="border-[3px] border-ink bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-coin"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">
                <span className="font-pixel text-[9px] uppercase">5. Raipur Ward & Clan *</span>
                <select
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                  className="border-[3px] border-ink bg-white p-2.5 text-sm outline-none"
                >
                  {WARDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.official} - {w.game} ({w.area})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">
                <span className="font-pixel text-[9px] uppercase">6. Location Address / Landmark *</span>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near Marine Drive Telibandha, Raipur"
                  className="border-[3px] border-ink bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-coin"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">
                <span className="font-pixel text-[9px] uppercase">7. Description / Notes</span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain traffic impact, water stagnation, or duration of the issue..."
                  className="border-[3px] border-ink bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-coin"
                />
              </label>
            </div>

            <PixelButton
              type="submit"
              variant="red"
              disabled={isSubmitting || uploadingPhoto}
              className="mt-2 w-full py-4 text-xs font-bold"
            >
              {isSubmitting ? 'Saving to Raipur Database...' : '🚀 Submit Report (+40 Coins)'}
            </PixelButton>
          </form>
        </div>

        {/* AI Pre-Inspection & Reward Info */}
        <div className="flex flex-col gap-6">
          <CCard title="Raipur AI Pre-Inspection" className="bg-gradient-to-b from-amber-50 to-white">
            <div className="flex items-center gap-2 text-emerald-700 font-pixel text-[9px]">
              <Sparkles className="size-4 animate-spin" />
              <span>AI Engine Active (94% match)</span>
            </div>
            <ul className="mt-4 flex flex-col gap-3 text-xs">
              <li className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="text-ink/70">Category:</span>
                <span className="font-bold">{category}</span>
              </li>
              <li className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="text-ink/70">Severity:</span>
                <span className="font-bold text-mario">{currentCat.severity}</span>
              </li>
              <li className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="text-ink/70">Target SLA:</span>
                <span className="font-bold">48 - 72 Hours</span>
              </li>
              <li className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="text-ink/70">Municipal Squad:</span>
                <span className="font-bold">Raipur Nagar Nigam</span>
              </li>
            </ul>

            <div className="mt-4 rounded border-2 border-dashed border-emerald-600 bg-emerald-50 p-3">
              <p className="flex items-center gap-1.5 font-pixel text-[8px] uppercase text-emerald-800">
                <CheckCircle2 className="size-3.5" /> Real OpenStreetMap Coordinates
              </p>
              <p className="mt-1 text-xs text-emerald-900">
                Issue will be marked on the live Raipur Municipal Command heatmap with exact GPS latitude and longitude.
              </p>
            </div>
          </CCard>

          <CCard title="Bounty Rewards" className="bg-amber-100/70">
            <div className="flex items-center gap-3">
              <Coin size={24} />
              <div>
                <p className="font-pixel text-xs text-amber-900">+40 Guardian Coins</p>
                <p className="text-xs text-ink/70">Credited to {citizen.name}&apos;s chest</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xl">🏆</span>
              <div>
                <p className="font-pixel text-xs text-amber-900">+30 Clan Trophies</p>
                <p className="text-xs text-ink/70">Advances {citizen.clan} in Raipur League</p>
              </div>
            </div>
          </CCard>
        </div>
      </div>
    </div>
  )
}
