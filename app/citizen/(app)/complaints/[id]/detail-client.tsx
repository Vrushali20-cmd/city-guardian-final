'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, CheckCircle2, MessageSquare, ThumbsUp, AlertCircle, Share2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { wardById } from '@/lib/data'
import { CCard } from '@/components/citizen/c-ui'
import { Coin, SeverityBadge, StatusBadge } from '@/components/mario/pixel-ui'
import { Countdown } from '@/components/mario/timers'
import { LifecycleTrack } from '@/components/portal/lifecycle-track'
import dynamic from 'next/dynamic'

const CityMap = dynamic(
  () => import('@/components/maps/city-map').then((mod) => mod.CityMap),
  { ssr: false }
)

export function CitizenComplaintDetailClient({ id }: { id: string }) {
  const { complaints, citizen, updateComplaintStatus, upvoteComplaint } = useCityGuardian()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([
    { author: 'AI City Guardian Bot', text: 'Issue registered and analyzed with 94% machine confidence.', time: '2 days ago' },
    { author: 'Raipur Nagar Nigam Dispatch', text: 'Dispatched to Ward Rapid Action Team. Scheduled for priority resolution.', time: '1 day ago' },
  ])

  const complaint = complaints.find((x) => x.id === id)
  if (!complaint) return notFound()

  const ward = wardById(complaint.wardId)
  const isMine = complaint.reportedBy === citizen.name

  const handleUpvote = () => {
    upvoteComplaint(complaint.id)
    toast.success(`Upvoted! Priority increased for ${complaint.id}`)
  }

  const handleConfirmResolution = () => {
    updateComplaintStatus(complaint.id, 'rewarded')
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } })
    toast.success('🎉 Victory! You verified the fix and earned +50 Coins + 10 Gems!', {
      description: 'Your verification points have been credited to your Clan Chest.',
    })
  }

  const handleDispute = () => {
    updateComplaintStatus(complaint.id, 'disputed')
    toast.error('Flagged as Disputed: Sent to Municipal Inspector for immediate re-investigation.')
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setComments((prev) => [...prev, { author: citizen.name, text: commentText, time: 'Just now' }])
    setCommentText('')
    toast.success('Note added to quest log!')
  }

  return (
    <div className="flex flex-col gap-6 text-ink">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/citizen/complaints" className="font-pixel text-[9px] uppercase text-ink underline">
          {'< Back to Quest Log'}
        </Link>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href)
            toast.success('Link copied! Share with your neighborhood clan.')
          }}
          className="flex items-center gap-1.5 border border-ink bg-white px-2.5 py-1 text-xs font-bold hover:bg-coin"
        >
          <Share2 className="size-3.5" /> Share Quest
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="border border-ink bg-ink px-2 py-1 font-pixel text-[8px] text-coin">{complaint.id}</span>
        <SeverityBadge severity={complaint.severity} />
        <StatusBadge status={complaint.status} />
        <span className="border-2 border-ink bg-amber-100 px-2 py-1 font-pixel text-[8px] uppercase">
          {complaint.category}
        </span>
        {isMine && (
          <span className="border border-ink bg-mario px-2 py-1 font-pixel text-[7px] uppercase text-white">
            Your Report
          </span>
        )}
      </div>

      <h1 className="text-outline font-pixel text-base uppercase leading-relaxed text-white md:text-xl">
        {complaint.title}
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Details & Photos */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CCard title="Visual Evidence & Progress">
            <div className="grid gap-4 sm:grid-cols-2">
              <figure>
                <div className="relative aspect-video overflow-hidden border-[3px] border-ink bg-sand/30">
                  <Image src={complaint.image || '/placeholder.svg'} alt={`Before: ${complaint.title}`} fill sizes="400px" className="object-cover" />
                </div>
                <figcaption className="mt-2 flex items-center justify-between font-pixel text-[8px] uppercase text-ink/70">
                  <span>Before (Citizen Upload)</span>
                  <span className="text-mario">Reported</span>
                </figcaption>
              </figure>

              <figure>
                <div className="relative grid aspect-video place-items-center overflow-hidden border-[3px] border-dashed border-ink bg-amber-50">
                  {complaint.afterImage ? (
                    <Image src={complaint.afterImage || '/placeholder.svg'} alt={`After fix: ${complaint.title}`} fill sizes="400px" className="object-cover" />
                  ) : (
                    <div className="p-4 text-center">
                      <span className="text-2xl">⏳</span>
                      <p className="mt-2 font-pixel text-[8px] uppercase text-ink/60">Work in Progress</p>
                      <p className="text-xs text-ink/60">After-fix photo will be posted by ward inspectors</p>
                    </div>
                  )}
                </div>
                <figcaption className="mt-2 flex items-center justify-between font-pixel text-[8px] uppercase text-ink/70">
                  <span>After Fix Proof</span>
                  <span className="text-pipe-dark">{complaint.afterImage ? 'Resolved' : 'Pending'}</span>
                </figcaption>
              </figure>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink/90">{complaint.description}</p>
          </CCard>

          {/* Citizen Verification Action Box (If Resolved) */}
          {['resolved', 'inspection_verified'].includes(complaint.status) && (
            <div className="pixel-box animate-drop-in border-4 border-pipe bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-8 text-pipe-dark" />
                <div>
                  <h3 className="font-pixel text-xs uppercase text-pipe-dark font-bold">Municipal Work Completed!</h3>
                  <p className="text-sm text-ink/80">
                    Nagar Nigam marked this issue resolved. Please verify if the fix looks good in person to claim your reward!
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleConfirmResolution}
                  className="pixel-press flex items-center gap-2 border-[3px] border-ink bg-pipe px-4 py-2.5 font-pixel text-[9px] uppercase text-white shadow-[3px_3px_0_0_#14101f]"
                >
                  <Check className="size-4" /> Confirm Fix & Claim 50 Coins!
                </button>
                <button
                  type="button"
                  onClick={handleDispute}
                  className="pixel-press flex items-center gap-2 border-[3px] border-ink bg-mario px-4 py-2.5 font-pixel text-[9px] uppercase text-white shadow-[3px_3px_0_0_#14101f]"
                >
                  <AlertCircle className="size-4" /> Issue Not Fixed (Dispute)
                </button>
              </div>
            </div>
          )}

          {/* AI Recommended Approach */}
          <CCard title="AI Predictive Analysis">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="border-2 border-ink bg-amber-50/70 p-3">
                <dt className="font-pixel text-[8px] uppercase text-amber-800">AI Confidence Score</dt>
                <dd className="mt-1 flex items-center gap-2 font-bold text-emerald-700">
                  <Sparkles className="size-4" /> {complaint.ai.confidence}% Machine Match
                </dd>
              </div>
              <div className="border-2 border-ink bg-amber-50/70 p-3">
                <dt className="font-pixel text-[8px] uppercase text-amber-800">Estimated Effort</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{complaint.ai.effort}</dd>
              </div>
              <div className="border-2 border-ink bg-amber-50/70 p-3">
                <dt className="font-pixel text-[8px] uppercase text-amber-800">Expected Timeline</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{complaint.ai.timeline}</dd>
              </div>
              <div className="border-2 border-ink bg-amber-50/70 p-3">
                <dt className="font-pixel text-[8px] uppercase text-amber-800">Historical Comparison</dt>
                <dd className="mt-1 text-xs text-ink/80">{complaint.ai.similar}</dd>
              </div>
            </dl>
          </CCard>

          {/* Quest Log Comments & Activity */}
          <CCard title="Community Quest Activity & Notes">
            <ul className="flex flex-col gap-3">
              {comments.map((cm, idx) => (
                <li key={idx} className="border-2 border-ink bg-cream/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[8px] uppercase font-bold text-amber-900">{cm.author}</span>
                    <span className="text-[10px] text-ink/60">{cm.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/90">{cm.text}</p>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post an update or note about this issue..."
                className="flex-1 border-[3px] border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-coin"
              />
              <button
                type="submit"
                className="pixel-press border-[3px] border-ink bg-coin px-4 py-2 font-pixel text-[8px] uppercase font-bold text-ink shadow-[2px_2px_0_0_#14101f]"
              >
                Post
              </button>
            </form>
          </CCard>
        </div>

        {/* Sidebar Info & Lifecycle */}
        <div className="flex flex-col gap-6">
          {/* Upvote & Bounty Card */}
          <CCard className="bg-gradient-to-b from-amber-100 to-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-pixel text-[8px] uppercase text-amber-800">Community Priority</p>
                <p className="mt-1 font-pixel text-xl font-bold text-ink">{complaint.upvotes} Upvotes</p>
              </div>
              <button
                onClick={handleUpvote}
                className="pixel-press flex items-center gap-1.5 border-[3px] border-ink bg-amber-400 px-4 py-2.5 font-pixel text-[9px] uppercase shadow-[3px_3px_0_0_#14101f] hover:bg-amber-300"
              >
                <ThumbsUp className="size-4" /> Boost +1
              </button>
            </div>
            <p className="mt-3 text-xs text-ink/70">
              Each upvote raises this issue higher on the Municipal Command Castle queue!
            </p>
          </CCard>

          {/* Lifecycle Tracker */}
          <CCard title="Fix Lifecycle Progress">
            <LifecycleTrack status={complaint.status} dark={false} />
          </CCard>

          {/* Location & Ward Info */}
          <CCard title="Location & Clan Info">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between border-b border-ink/10 pb-1.5">
                <dt className="text-ink/70">Ward Clan</dt>
                <dd className="font-bold">{ward.game} ({ward.official})</dd>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-1.5">
                <dt className="text-ink/70">Reported By</dt>
                <dd className="font-semibold">{complaint.reportedBy}</dd>
              </div>
              <div className="flex justify-between border-b border-ink/10 pb-1.5">
                <dt className="text-ink/70">SLA Countdown</dt>
                <dd><Countdown deadline={complaint.deadline} /></dd>
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <dt className="text-ink/70">Specific Landmark</dt>
                <dd className="font-medium text-xs text-ink">{complaint.location}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <CityMap
                className="h-48 w-full border-2 border-ink"
                zoom={14}
                points={[{ id: complaint.id, lat: complaint.lat, lng: complaint.lng, color: '#e52521', title: complaint.location }]}
              />
            </div>
          </CCard>
        </div>
      </div>
    </div>
  )
}

