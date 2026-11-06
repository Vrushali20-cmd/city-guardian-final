'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Coffee, Gift, HeartHandshake, QrCode, Search, Sparkles, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin, PixelButton, PixelLink } from '@/components/mario/pixel-ui'

export default function PartnerDashboardPage() {
  const { citizen, coupons, updateCitizen } = useCityGuardian()
  const [verifyCode, setVerifyCode] = useState('')
  const [partnerImpact, setPartnerImpact] = useState(920)

  // Partner coupons (for Chhappan Brew Co. or current merchant)
  const myCoupons = coupons.filter((c) => c.partner.includes('Chhappan') || c.category === 'Cafe')

  const handleVerifyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = verifyCode.trim().toUpperCase()
    if (!clean) return

    // Search in citizen redeemed coupons
    const match = citizen.redeemedCoupons?.find((v) => v.code.toUpperCase() === clean)

    if (match) {
      if (match.status === 'used') {
        toast.error(`Voucher ${clean} has ALREADY been used on ${new Date(match.redeemedAt).toLocaleDateString()}!`)
        return
      }

      // Mark as used
      const updated = citizen.redeemedCoupons.map((v) =>
        v.code.toUpperCase() === clean ? { ...v, status: 'used' as const } : v,
      )
      updateCitizen({ redeemedCoupons: updated })
      setPartnerImpact((prev) => prev + 25)
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      toast.success(`🎉 Voucher Verified! ${match.title}`, {
        description: `Customer granted offer. +25 CSR Impact Points added to your brand!`,
      })
      setVerifyCode('')
    } else {
      toast.error(`Invalid voucher code "${clean}". Please check with customer.`)
    }
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Chhappan Brew Co. - Partner Guild"
        subtitle="Tier 1 Verified Green Merchant - Indore Swachhata CSR Alliance"
        action={
          <PixelLink href="/partner/coupons" variant="yellow" className="flex items-center gap-2">
            <PlusCircle className="size-4" /> Create Coupon
          </PixelLink>
        }
      />

      {/* CSR Impact & Vitals Card */}
      <CCard className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center border-[3px] border-ink bg-royal text-white shadow-[3px_3px_0_0_#14101f]">
              <HeartHandshake className="size-9" />
            </div>
            <div>
              <span className="font-pixel text-[8px] uppercase font-bold text-amber-950">Verified CSR Merchant</span>
              <h2 className="mt-1 font-pixel text-lg text-ink">Chhappan Brew Co.</h2>
              <p className="text-xs text-ink/75 font-semibold">Active in Ward 7 (Holkar Heroes Clan) - 56 Dukan</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="border-2 border-ink bg-white/95 px-3 py-2 text-center shadow-[2px_2px_0_0_#14101f]">
              <p className="font-pixel text-base font-bold text-amber-800">{partnerImpact}</p>
              <p className="text-[8px] uppercase font-bold text-ink/70">Impact Score</p>
            </div>
            <div className="border-2 border-ink bg-white/95 px-3 py-2 text-center shadow-[2px_2px_0_0_#14101f]">
              <p className="font-pixel text-base font-bold text-pipe-dark">{myCoupons.length}</p>
              <p className="text-[8px] uppercase font-bold text-ink/70">Live Coupons</p>
            </div>
            <div className="border-2 border-ink bg-white/95 px-3 py-2 text-center shadow-[2px_2px_0_0_#14101f]">
              <p className="font-pixel text-base font-bold text-blue-700">214</p>
              <p className="text-[8px] uppercase font-bold text-ink/70">Redemptions</p>
            </div>
          </div>
        </div>
      </CCard>

      {/* In-Store Customer Voucher Scanner & Validator */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CCard title="In-Store Customer Voucher Validator" className="border-4 border-amber-500 bg-amber-50/50">
            <p className="text-xs text-ink/80">
              When a citizen visits your cafe or store with a redeemed voucher code from the Citizen Coin Shop, enter or scan the code here to validate and apply the reward:
            </p>

            <form onSubmit={handleVerifyVoucher} className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <QrCode className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/50" />
                <input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter Voucher Code (e.g. COC-CHHAPPAN-7842)..."
                  className="w-full border-[3px] border-ink bg-white py-2.5 pl-10 pr-3 font-pixel text-xs tracking-wider uppercase text-ink outline-none focus:ring-2 focus:ring-coin"
                />
              </div>
              <PixelButton type="submit" variant="green" className="py-2.5 text-[9px]">
                Verify & Claim
              </PixelButton>
            </form>

            <div className="mt-4 rounded border-2 border-dashed border-ink/30 bg-white p-3 text-xs text-ink/70">
              <span className="font-bold text-amber-900">💡 Quick Test Hint:</span> Use citizen default code{' '}
              <strong className="select-all font-pixel text-[10px] text-ink">COC-CHHAPPAN-7842</strong> or any code redeemed from the{' '}
              <Link href="/citizen/rewards" className="underline font-bold text-blue-600">
                Citizen Coin Shop
              </Link>
              !
            </div>
          </CCard>

          {/* Active Merchant Coupons */}
          <CCard title="Your Active Reward Coupons">
            <div className="grid gap-4 sm:grid-cols-2">
              {myCoupons.map((c) => (
                <div key={c.id} className="border-2 border-ink bg-white p-3 shadow-[2px_2px_0_0_#14101f]">
                  <div className="relative h-28 border-b-2 border-ink">
                    <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="300px" className="object-cover" />
                    <span className="absolute left-2 top-2 border border-ink bg-ink px-2 py-0.5 font-pixel text-[7px] text-coin">
                      Stock: {c.stock}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    <h3 className="font-bold text-sm text-ink">{c.title}</h3>
                    <div className="flex items-center justify-between text-xs text-ink/70">
                      <span className="flex items-center gap-1 font-pixel text-[9px] text-amber-800">
                        <Coin size={12} spin={false} /> {c.cost} coins
                      </span>
                      <span className="text-[10px]">Exp: {new Date(c.expiry).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CCard>
        </div>

        {/* Sidebar: CSR Green Certificate */}
        <div className="flex flex-col gap-6">
          <CCard title="Swachh Indore CSR Certification" className="bg-amber-100/60">
            <div className="text-center p-2">
              <span className="text-4xl">🏅</span>
              <h3 className="mt-2 font-pixel text-xs uppercase font-bold text-amber-950">Grade A Civic Merchant</h3>
              <p className="mt-1 text-xs text-ink/80">
                Recognized by Indore Municipal Corporation for rewarding citizens who report city infrastructure issues.
              </p>
            </div>

            <div className="mt-4 border-t-2 border-ink/10 pt-3 flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink/70">Cleanliness Drives Sponsored:</span>
                <span className="font-bold">3 Events</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Citizen Footfall via App:</span>
                <span className="font-bold text-pipe-dark">214 Visitors</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Brand Ranking:</span>
                <span className="font-bold text-amber-800">#2 in Food & Beverages</span>
              </div>
            </div>
          </CCard>

          <CCard title="Host Community Event">
            <p className="text-xs text-ink/75">
              Host a Sunday morning cleanup drive or waste workshop at your venue and earn 100 CSR Impact points!
            </p>
            <PixelLink href="/partner/events" variant="red" className="mt-4 block text-center text-[8px]">
              Host Cleanup Event
            </PixelLink>
          </CCard>
        </div>
      </div>
    </div>
  )
}

