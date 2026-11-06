'use client'

import { HeartHandshake, Award, ShieldCheck, Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { PARTNERS } from '@/lib/data'
import { CCard, CPageHeader } from '@/components/citizen/c-ui'
import { PixelButton } from '@/components/mario/pixel-ui'

export default function PartnerImpactPage() {
  const sortedPartners = [...PARTNERS].sort((a, b) => b.impact - a.impact)

  const downloadCert = () => {
    toast.success('Certificate of Civic Honor downloaded! (PDF simulated)')
  }

  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="CSR Impact & Civic Rankings"
        subtitle="Transparent environmental and community contribution metrics audited by Indore Municipal Corporation."
      />

      {/* Official Certificate Card */}
      <CCard className="border-4 border-amber-500 bg-gradient-to-b from-amber-50 to-white text-center p-8">
        <span className="text-5xl">🏛️</span>
        <h2 className="mt-3 font-pixel text-base uppercase text-amber-950 font-bold">
          Indore Municipal Corporation - Certificate of Civic Honor
        </h2>
        <p className="mt-2 text-sm text-ink/80 max-w-xl mx-auto">
          Awarded to <strong>Chhappan Brew Co.</strong> for exceptional corporate civic participation, sponsoring 3 community cleanliness drives and providing 214 citizen reward redemptions.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 border-y-2 border-ink/15 py-4">
          <div>
            <p className="font-pixel text-lg text-amber-800 font-bold">920 PTS</p>
            <p className="text-[10px] uppercase font-bold text-ink/70">Verified CSR Impact</p>
          </div>
          <div>
            <p className="font-pixel text-lg text-pipe-dark font-bold">3.4 TONNES</p>
            <p className="text-[10px] uppercase font-bold text-ink/70">Civic Waste Diverted</p>
          </div>
          <div>
            <p className="font-pixel text-lg text-blue-700 font-bold">#2 RANK</p>
            <p className="text-[10px] uppercase font-bold text-ink/70">Citywide Partner Rank</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <PixelButton type="button" variant="yellow" onClick={downloadCert} className="flex items-center gap-2">
            <Download className="size-4" /> Download Certificate
          </PixelButton>
        </div>
      </CCard>

      {/* CSR Leaderboard */}
      <CCard title="Citywide CSR & Partner Leaderboard">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-amber-100/70 font-pixel text-[8px] uppercase text-amber-950">
              <tr>
                {['Rank', 'Partner Name', 'Category', 'Active Coupons', 'Redemptions', 'Events Sponsored', 'Impact Score'].map((h) => (
                  <th key={h} className="border-b-2 border-ink px-3 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPartners.map((p, i) => (
                <tr key={p.id} className="border-b border-ink/10 hover:bg-amber-50/50">
                  <td className="px-3 py-3 font-pixel text-[10px] text-amber-800 font-bold">#{i + 1}</td>
                  <td className="px-3 py-3 font-bold text-ink flex items-center gap-2">
                    <HeartHandshake className="size-4 text-royal" />
                    <span>{p.name}</span>
                  </td>
                  <td className="px-3 py-3 font-medium">{p.type}</td>
                  <td className="px-3 py-3 font-semibold">{p.coupons}</td>
                  <td className="px-3 py-3 font-semibold text-pipe-dark">{p.redemptions}</td>
                  <td className="px-3 py-3 font-semibold">{p.events}</td>
                  <td className="px-3 py-3 font-pixel text-[10px] text-amber-900 font-bold">{p.impact} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CCard>
    </div>
  )
}

