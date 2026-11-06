import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { CouponModel } from '@/models/Coupon'
import { CitizenModel } from '@/models/Citizen'
import { CURRENT_CITIZEN } from '@/lib/data'

export async function GET() {
  try {
    await connectToDatabase()
    const coupons = await CouponModel.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: coupons })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()

    // Redeem action
    if (body.action === 'redeem') {
      const { couponId } = body
      const coupon = await CouponModel.findOne({ id: couponId })
      if (!coupon) {
        return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
      }
      if (coupon.stock <= 0) {
        return NextResponse.json({ success: false, error: 'Out of stock' }, { status: 400 })
      }

      const citizen = await CitizenModel.findOne({ email: CURRENT_CITIZEN.email })
      if (!citizen || citizen.points < coupon.cost) {
        return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 })
      }

      coupon.stock = Math.max(0, coupon.stock - 1)
      await coupon.save()

      const voucher = {
        id: `voucher-${Date.now()}`,
        couponId: coupon.id,
        title: coupon.title,
        partner: coupon.partner,
        code: `MARIO-${coupon.partner.replace(/\s+/g, '').toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        cost: coupon.cost,
        redeemedAt: new Date().toISOString(),
        category: coupon.category,
        status: 'active',
      }

      citizen.points -= coupon.cost
      citizen.redeemedCoupons = [voucher, ...(citizen.redeemedCoupons || [])]
      await citizen.save()

      return NextResponse.json({ success: true, voucher, citizen })
    }

    // Create new coupon
    const created = await CouponModel.create(body)
    return NextResponse.json({ success: true, data: created })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

