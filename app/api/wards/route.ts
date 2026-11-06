import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { WardModel } from '@/models/Ward'

export async function GET() {
  try {
    await connectToDatabase()
    const wards = await WardModel.find().sort({ points: -1 })
    return NextResponse.json({ success: true, data: wards })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

