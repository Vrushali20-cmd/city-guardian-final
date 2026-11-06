import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { CitizenModel } from '@/models/Citizen'
import { CURRENT_CITIZEN } from '@/lib/data'

export async function GET() {
  try {
    await connectToDatabase()
    let citizen = await CitizenModel.findOne({ email: CURRENT_CITIZEN.email })
    if (!citizen) {
      citizen = await CitizenModel.create({
        ...CURRENT_CITIZEN,
        gems: 75,
        elixir: 450,
        clan: 'Holkar Heroes',
        clanRole: 'Co-Leader',
        clanTrophies: 1840,
        townHallLevel: 8,
        avatar: 'mario',
        title: 'Master Pothole Smasher',
      })
    }
    return NextResponse.json({ success: true, data: citizen })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase()
    const updates = await req.json()
    const citizen = await CitizenModel.findOneAndUpdate(
      { email: CURRENT_CITIZEN.email },
      { $set: updates },
      { new: true, upsert: true },
    )
    return NextResponse.json({ success: true, data: citizen })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

