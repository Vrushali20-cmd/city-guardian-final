import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COMPLAINTS, wardById } from '@/lib/data'
import { MPanel } from '@/components/municipal/m-ui'
import { ComplaintActions } from '@/components/municipal/complaint-actions'
import { SeverityBadge } from '@/components/mario/pixel-ui'
import { Countdown } from '@/components/mario/timers'
import { CityMap } from '@/components/maps/city-map'

export function generateStaticParams() {
  return COMPLAINTS.map((c) => ({ id: c.id }))
}

export default async function MunicipalComplaintDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = COMPLAINTS.find((x) => x.id === id)
  if (!c) notFound()
  const ward = wardById(c.wardId)

  return (
    <div className="flex flex-col gap-6 text-ink">
      <Link href="/municipal/complaints" className="font-pixel text-[9px] uppercase text-amber-800 underline">
        {'< Back to queue'}
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-pixel text-[9px] text-ink/70">{c.id}</span>
        <SeverityBadge severity={c.severity} />
        <span className="border-2 border-ink bg-white px-2 py-1 font-pixel text-[8px] uppercase text-ink">
          {c.category}
        </span>
      </div>
      <h1 className="font-pixel text-base uppercase leading-relaxed text-ink md:text-lg">{c.title}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <MPanel title="Evidence">
            <div className="grid gap-4 sm:grid-cols-2">
              <figure>
                <div className="relative aspect-video overflow-hidden border-[3px] border-ink">
                  <Image src={c.image || '/placeholder.svg'} alt={`Before: ${c.title}`} fill sizes="400px" className="object-cover" />
                </div>
                <figcaption className="mt-2 font-pixel text-[8px] uppercase text-ink/70">Before</figcaption>
              </figure>
              <figure>
                <div className="relative grid aspect-video place-items-center overflow-hidden border-[3px] border-dashed border-ink bg-sand/30">
                  {c.afterImage ? (
                    <Image src={c.afterImage || '/placeholder.svg'} alt={`After: ${c.title}`} fill sizes="400px" className="object-cover" />
                  ) : (
                    <span className="font-pixel text-[8px] uppercase text-ink/50">Awaiting after photo</span>
                  )}
                </div>
                <figcaption className="mt-2 font-pixel text-[8px] uppercase text-ink/70">After</figcaption>
              </figure>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink/90">{c.description}</p>
          </MPanel>

          <MPanel title="AI analysis">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ['Confidence', `${c.ai.confidence}%`],
                ['Effort', c.ai.effort],
                ['Est. timeline', c.ai.timeline],
                ['Similar cases', c.ai.similar],
              ].map(([k, v]) => (
                <div key={k} className="pixel-box-sm bg-amber-50/70 p-3">
                  <dt className="font-pixel text-[8px] uppercase text-amber-800">{k}</dt>
                  <dd className="mt-2 text-sm font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 pixel-box-sm bg-amber-50/70 p-3">
              <p className="font-pixel text-[8px] uppercase text-amber-800">Recommended approach</p>
              <p className="mt-2 text-sm text-ink">{c.ai.approach}</p>
            </div>
          </MPanel>

          <MPanel title="Location">
            <CityMap
              className="h-64 w-full border-[3px] border-ink"
              zoom={14}
              points={[{ id: c.id, lat: c.lat, lng: c.lng, color: '#e52521', title: c.location }]}
            />
          </MPanel>
        </div>

        <div className="flex flex-col gap-8">
          <MPanel title="Mission timer">
            <Countdown deadline={c.deadline} className="text-base" />
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between border-b border-ink/10 pb-1">
                <dt className="text-ink/70">Ward</dt>
                <dd className="font-semibold">{ward.official} - {ward.game}</dd>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-1">
                <dt className="text-ink/70">Reporter</dt>
                <dd className="font-semibold">{c.reportedBy}</dd>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-1">
                <dt className="text-ink/70">Upvotes</dt>
                <dd className="font-bold text-amber-700">{c.upvotes}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Location</dt>
                <dd className="font-semibold text-right">{c.location}</dd>
              </div>
            </dl>
          </MPanel>
          <MPanel title="Lifecycle control">
            <ComplaintActions id={c.id} initial={c.status} />
          </MPanel>
        </div>
      </div>
    </div>
  )
}
