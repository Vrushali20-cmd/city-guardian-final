import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ComplaintModel } from '@/models/Complaint'
import { CitizenModel } from '@/models/Citizen'
import { CouponModel } from '@/models/Coupon'
import { CityEventModel } from '@/models/CityEvent'
import { WardModel } from '@/models/Ward'
import { PartnerModel } from '@/models/Partner'
import { COMPLAINTS, COUPONS, EVENTS, PARTNERS, TEAM_MEMBERS, WARDS } from '@/lib/data'

export async function GET() {
  try {
    await connectToDatabase()

    // Refresh Wards for Raipur
    await WardModel.deleteMany({})
    await WardModel.insertMany(WARDS)

    // Seed/Refresh all 13 Team Members into MongoDB
    await CitizenModel.deleteMany({})
    const citizensToInsert = TEAM_MEMBERS.map((m) => ({
      ...m,
      redeemedCoupons: [
        {
          id: `rc-${m.name.toLowerCase().replace(/\s+/g, '-')}`,
          couponId: 'c1',
          title: 'Free Special Chai & Samosa',
          partner: 'Madhuram Sweets & Cafe',
          code: `RAIPUR-${m.name.slice(0, 3).toUpperCase()}-7842`,
          cost: 70,
          redeemedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          category: 'Cafe',
          status: 'active',
        },
      ],
      rsvpedEventIds: ['e1'],
    }))
    await CitizenModel.insertMany(citizensToInsert)

    // Seed Complaints
    const countComplaints = await ComplaintModel.countDocuments()
    if (countComplaints === 0) {
      await ComplaintModel.insertMany(COMPLAINTS)
    } else {
      // Update any old locations to Raipur
      const existing = await ComplaintModel.find({ id: 'CG-1042' })
      if (existing.length > 0 && !existing[0].location.includes('Raipur')) {
        await ComplaintModel.deleteMany({})
        await ComplaintModel.insertMany(COMPLAINTS)
      }
    }

    // Seed Coupons
    await CouponModel.deleteMany({})
    await CouponModel.insertMany(COUPONS)

    // Seed Events
    await CityEventModel.deleteMany({})
    await CityEventModel.insertMany(EVENTS)

    // Seed Partners
    await PartnerModel.deleteMany({})
    await PartnerModel.insertMany(PARTNERS)

    return NextResponse.json({
      success: true,
      message: 'Raipur City Guardian & all 13 Team Members seeded successfully in MongoDB!',
      city: 'Raipur, Chhattisgarh',
      counts: {
        citizens: await CitizenModel.countDocuments(),
        complaints: await ComplaintModel.countDocuments(),
        wards: await WardModel.countDocuments(),
        coupons: await CouponModel.countDocuments(),
        events: await CityEventModel.countDocuments(),
        partners: await PartnerModel.countDocuments(),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
