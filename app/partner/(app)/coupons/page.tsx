'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PlusCircle, Tag, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { useCityGuardian } from '@/lib/storage'
import { type Coupon } from '@/lib/data'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { Coin, PixelButton } from '@/components/mario/pixel-ui'

export default function PartnerCouponsPage() {
  const { coupons, addCoupon } = useCityGuardian()

  const [title, setTitle] = useState('')
  const [cost, setCost] = useState(80)
  const [stock, setStock] = useState(30)
  const [category, setCategory] = useState<'Cafe' | 'Restaurant' | 'Retail' | 'CSR'>('Cafe')
  const [expiryDays, setExpiryDays] = useState(30)
  const [image, setImage] = useState('/images/cafe.png')

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newCoupon: Coupon = {
      id: `c${Date.now()}`,
      partner: 'Chhappan Brew Co.',
      title,
      cost: Number(cost),
      stock: Number(stock),
      category,
      expiry: new Date(Date.now() + 86400000 * expiryDays).toISOString(),
      image,
    }

    addCoupon(newCoupon)
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
    toast.success(`Reward Coupon "${title}" published!`, {
      description: 'Now available in the Citizen Coin Shop for redemption.',
    })

    setTitle('')
    setCost(80)
    setStock(30)
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Partner Reward Coupons"
        subtitle="Create discount vouchers and merchandise rewards for citizens who clean and protect Indore."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form to create coupon */}
        <form onSubmit={handleCreateCoupon} className="pixel-box flex h-fit flex-col gap-4 bg-white p-5">
          <h2 className="font-pixel text-[10px] uppercase text-ink flex items-center gap-2">
            <PlusCircle className="size-4 text-pipe-dark" />
            <span>Create New Reward Coupon</span>
          </h2>

          <label className="flex flex-col gap-1 text-sm font-bold text-ink">
            <span className="font-pixel text-[8px] uppercase">Coupon Title *</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 50% Off Fresh Croissant"
              className="border-[3px] border-ink bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-coin"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-bold text-ink">
              <span className="font-pixel text-[8px] uppercase">Cost (Coins)</span>
              <input
                type="number"
                min={10}
                max={1000}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="border-[3px] border-ink bg-white p-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold text-ink">
              <span className="font-pixel text-[8px] uppercase">Stock Qty</span>
              <input
                type="number"
                min={1}
                max={500}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="border-[3px] border-ink bg-white p-2 text-sm outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-bold text-ink">
            <span className="font-pixel text-[8px] uppercase">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="border-[3px] border-ink bg-white p-2 text-sm outline-none"
            >
              <option value="Cafe">Cafe</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Retail">Retail</option>
              <option value="CSR">CSR / Sustainability</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-bold text-ink">
            <span className="font-pixel text-[8px] uppercase">Validity (Days)</span>
            <input
              type="number"
              min={1}
              max={180}
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              className="border-[3px] border-ink bg-white p-2 text-sm outline-none"
            />
          </label>

          <PixelButton type="submit" variant="yellow" className="mt-2 w-full">
            Publish to Citizen Shop
          </PixelButton>
        </form>

        {/* Existing Coupons Catalog */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-outline font-pixel text-sm uppercase text-white">Live Published Coupons ({coupons.length})</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {coupons.map((c) => (
              <div key={c.id} className="pixel-box flex flex-col justify-between overflow-hidden bg-white">
                <div>
                  <div className="relative h-32 border-b-[3px] border-ink">
                    <Image src={c.image || '/placeholder.svg'} alt={c.title} fill sizes="400px" className="object-cover" />
                    <span className="absolute left-2 top-2 border border-ink bg-ink px-2 py-0.5 font-pixel text-[7px] text-coin">
                      {c.category}
                    </span>
                    <span className="absolute right-2 top-2 border border-ink bg-white px-2 py-0.5 font-pixel text-[7px] text-ink font-bold">
                      Stock: {c.stock}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-1">
                    <p className="font-pixel text-[8px] uppercase text-amber-800 font-bold">{c.partner}</p>
                    <h3 className="font-bold text-sm text-ink">{c.title}</h3>
                    <p className="text-xs text-ink/70">
                      Expires: {new Date(c.expiry).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-ink/10 bg-amber-50/70 p-3">
                  <span className="flex items-center gap-1 font-pixel text-xs text-amber-900 font-bold">
                    <Coin size={14} spin={false} /> {c.cost} coins
                  </span>
                  <span className="border border-ink bg-pipe px-2 py-0.5 font-pixel text-[7px] uppercase text-white">
                    Active in Shop
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

