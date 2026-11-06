import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ComplaintModel } from '@/models/Complaint'
import { WardModel } from '@/models/Ward'
import { CitizenModel } from '@/models/Citizen'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const complaint = await ComplaintModel.findOne({ id })
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: complaint })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = await req.json()

    const complaint = await ComplaintModel.findOne({ id })
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 })
    }

    if (body.status) {
      complaint.status = body.status
      if (body.status === 'resolved' || body.status === 'rewarded') {
        await WardModel.findOneAndUpdate(
          { id: complaint.wardId },
          { $inc: { resolved: 1, points: 50 } },
        )
      }
      if (body.status === 'rewarded') {
        await CitizenModel.findOneAndUpdate(
          { email: 'aarav@cityguardian.in' },
          { $inc: { points: 50, gems: 10 } },
        )
      }
    }

    if (body.action === 'upvote') {
      complaint.upvotes = (complaint.upvotes || 0) + 1
    }

    if (body.afterImage) {
      complaint.afterImage = body.afterImage
    }

    await complaint.save()
    return NextResponse.json({ success: true, data: complaint })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

