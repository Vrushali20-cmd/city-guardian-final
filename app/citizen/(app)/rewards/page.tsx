'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Gift, Sparkles, Flame, Check, Tag, QrCode, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin, PixelButton } from '@/components/mario/pixel-ui'

const BONUS_PERKS = [
  {
    id: 'perk-1',
    title: 'Mario 1-UP Mushroom Clan Shield',
    partner: 'Nagar Nigam Clan Forge',
    cost: 150,
    stock: 50,
    category: 'Perk',
    expiry: 'Permanent',
    image: '/images/hero-city.png',
    description: 'Protect your ward from SLA penalty and gain +10% bonus points on all quests.',
  },
  {
    id: 'perk-2',
    title: 'Town Hall 2x XP Potion (24h)',
    partner: 'Clash Alchemist',
    cost: 100,
    stock: 75,
    category: 'Perk',
    expiry: '24 Hours',
    image: '/images/cleanup.png',
    description: 'Double all XP earned from reporting potholes, waste, and attending cleanliness drives.',
  },
  {
    id: 'perk-3',
    title: '5% Property Tax Rebate Voucher',
    partner: 'Indore Municipal Corporation',
    cost: 300,
    stock: 20,
    category: 'City',
    expiry: 'Valid 6 Months',
    image: '/images/pothole.png',
    description: 'Official municipal rebate token applicable on yearly property tax payment.',
  },
]

export default function RewardsShopPage() {
  const { citizen, coupons, redeemCoupon } = useCityGuardian()
  const [selectedCat, setSelectedCat] = useState('All')
  const [redeemedTab, setRedeemedTab] = useState(false)

  const allCoupons = [...coupons, ...BONUS_PERKS]

  const categories = ['All', 'Cafe', 'Restaurant', 'Retail', 'CSR', 'Perk', 'City']

  const filteredCoupons = allCoupons.filter((c) => {
    if (selectedCat !== 'All' && c.category !== selectedCat) return false
    return true
  })

  const handleRedeem = (couponId: string) => {
    const res = redeemCoupon(couponId)
    if (res.success) {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } })
      toast.success(res.message, {
        description: `Voucher Code: ${res.voucher?.code}`,
      })
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Guardian Coin Shop & Clan Market"
        subtitle="Spend your hard-earned Guardian Coins on local food, shopping vouchers, and city tax perks!"
      />

      {/* Balance & Vault Banner */}
      <CCard className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center border-[3px] border-ink bg-amber-400">
              <ShoppingBag className="size-8 text-ink" />
            </div>
            <div>
              <p className="font-pixel text-[9px] uppercase text-amber-900 font-bold">Your Clan Treasure Chest</p>
              <h2 className="mt-1 font-pixel text-xl text-ink">
                {citizen.name.split(' ')[0]}&apos;s Vault
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 border-[3px] border-ink bg-white px-4 py-2 shadow-[2px_2px_0_0_#14101f]">
              <Coin size={20} spin={false} />
              <div>
                <p className="font-pixel text-sm text-amber-700">{citizen.points}</p>
                <p className="text-[8px] font-bold uppercase text-ink/70">Coins</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-[3px] border-ink bg-white px-4 py-2 shadow-[2px_2px_0_0_#14101f]">
              <Sparkles className="size-5 text-emerald-600" />
              <div>
                <p className="font-pixel text-sm text-emerald-700">{citizen.gems}</p>
                <p className="text-[8px] font-bold uppercase text-ink/70">Gems</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-[3px] border-ink bg-white px-4 py-2 shadow-[2px_2px_0_0_#14101f]">
              <Flame className="size-5 text-pink-600" />
              <div>
                <p className="font-pixel text-sm text-pink-700">{citizen.elixir}</p>
                <p className="text-[8px] font-bold uppercase text-ink/70">Elixir</p>
              </div>
            </div>
          </div>
        </div>
      </CCard>

      {/* Nav between Shop and My Redeemed Inventory */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat)
                setRedeemedTab(false)
              }}
              className={`pixel-press border-[2px] border-ink px-3 py-1.5 font-pixel text-[8px] uppercase transition-all ${
                !redeemedTab && selectedCat === cat
                  ? 'bg-amber-400 font-bold text-ink shadow-[2px_2px_0_0_#14101f]'
                  : 'bg-white text-ink hover:bg-amber-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setRedeemedTab(!redeemedTab)}
          className={`pixel-press flex items-center gap-2 border-[3px] border-ink px-4 py-1.5 font-pixel text-[9px] uppercase shadow-[2px_2px_0_0_#14101f] ${
            redeemedTab ? 'bg-pipe text-white' : 'bg-coin text-ink'
          }`}
        >
          <Tag className="size-3.5" />
          <span>My Redeemed Loot ({citizen.redeemedCoupons?.length || 0})</span>
        </button>
      </div>

      {/* Display Redeemed Inventory OR Shop Catalog */}
      {redeemedTab ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-outline font-pixel text-sm uppercase text-white">My Active Vouchers & Perks</h2>
          {(!citizen.redeemedCoupons || citizen.redeemedCoupons.length === 0) ? (
            <div className="border-[3px] border-dashed border-ink bg-white/90 p-12 text-center">
              <p className="font-pixel text-sm text-ink">Your loot bag is empty</p>
              <p className="mt-2 text-sm text-ink/70">Redeem any coupon below to get a merchant discount code!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {citizen.redeemedCoupons.map((item) => (
                <div key={item.id} className="pixel-box flex flex-col justify-between bg-white p-5">
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-ink/20 pb-2">
                      <span className="font-pixel text-[8px] uppercase text-amber-800">{item.partner}</span>
                      <span className="border border-ink bg-pipe px-2 py-0.5 font-pixel text-[7px] uppercase text-white">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold text-ink text-base">{item.title}</h3>
                    <p className="mt-1 text-xs text-ink/65">
                      Redeemed on {new Date(item.redeemedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>

                  <div className="mt-4 border-2 border-dashed border-ink bg-amber-50 p-3 text-center">
                    <p className="text-[9px] font-bold uppercase text-ink/60">Voucher Passcode</p>
                    <p className="mt-1 font-pixel text-xs tracking-wider text-amber-900 select-all">{item.code}</p>
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink/70">
                      <QrCode className="size-4" />
                      <span>Show at counter</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCoupons.map((c) => {
            const canAfford = citizen.points >= c.cost
            return (
              <div
                key={c.id}
                className="pixel-box group flex flex-col justify-between overflow-hidden bg-white transition-transform hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-40 border-b-[3px] border-ink">
                    <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="400px" className="object-cover" />
                    <span className="absolute left-2 top-2 border border-ink bg-ink px-2 py-1 font-pixel text-[8px] text-coin">
                      {c.category}
                    </span>
                    <span className="absolute right-2 top-2 border border-ink bg-white/95 px-2 py-1 font-pixel text-[8px] text-ink">
                      Stock: {c.stock}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 p-4">
                    <p className="font-pixel text-[8px] uppercase text-amber-800 font-bold">{c.partner}</p>
                    <h3 className="font-bold text-ink text-base group-hover:text-mario">{c.title}</h3>
                    {(c as any).description && (
                      <p className="text-xs text-ink/75">{(c as any).description}</p>
                    )}
                    <p className="text-xs text-ink/60">Expires: {c.expiry ? new Date(c.expiry).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'No Expiry'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-ink/10 bg-amber-50/60 p-4">
                  <div className="flex items-center gap-1.5 font-pixel text-xs font-bold text-amber-900">
                    <Coin size={16} spin={false} />
                    <span>{c.cost} Coins</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedeem(c.id)}
                    disabled={!canAfford || c.stock <= 0}
                    className={`pixel-press border-[2px] border-ink px-4 py-2 font-pixel text-[8px] uppercase shadow-[2px_2px_0_0_#14101f] ${
                      !canAfford
                        ? 'bg-ink/10 text-ink/40 cursor-not-allowed'
                        : 'bg-pipe text-white hover:bg-pipe-dark'
                    }`}
                  >
                    {!canAfford ? 'Need Coins' : c.stock <= 0 ? 'Sold Out' : 'Redeem Loot'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

