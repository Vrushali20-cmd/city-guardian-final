import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ComplaintModel } from '@/models/Complaint'
import { CitizenModel } from '@/models/Citizen'
import { WardModel } from '@/models/Ward'

export async function GET() {
  try {
    await connectToDatabase()
    const complaints = await ComplaintModel.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: complaints })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()

    const created = await ComplaintModel.create(body)

    // Reward citizen
    await CitizenModel.findOneAndUpdate(
      { email: 'aarav@cityguardian.in' },
      {
        $inc: { points: 40, gems: 5, xp: 25, clanTrophies: 30 },
      },
    )

    // Update ward count
    if (body.wardId) {
      await WardModel.findOneAndUpdate(
        { id: body.wardId },
        {
          $inc: { pending: 1, points: 10 },
        },
      )
    }

    return NextResponse.json({ success: true, data: created })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

