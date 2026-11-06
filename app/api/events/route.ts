import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { CityEventModel } from '@/models/CityEvent'
import { CitizenModel } from '@/models/Citizen'
import { CURRENT_CITIZEN } from '@/lib/data'

export async function GET() {
  try {
    await connectToDatabase()
    const events = await CityEventModel.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: events })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()

    // Toggle RSVP
    if (body.action === 'rsvp') {
      const { eventId } = body
      const ev = await CityEventModel.findOne({ id: eventId })
      if (!ev) {
        return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })
      }

      const citizen = await CitizenModel.findOne({ email: CURRENT_CITIZEN.email })
      if (!citizen) {
        return NextResponse.json({ success: false, error: 'Citizen not found' }, { status: 404 })
      }

      const isRsvped = (citizen.rsvpedEventIds || []).includes(eventId)
      if (isRsvped) {
        citizen.rsvpedEventIds = citizen.rsvpedEventIds.filter((x: string) => x !== eventId)
        ev.rsvps = Math.max(0, ev.rsvps - 1)
      } else {
        citizen.rsvpedEventIds = [...(citizen.rsvpedEventIds || []), eventId]
        citizen.points += 25
        ev.rsvps = (ev.rsvps || 0) + 1
      }

      await citizen.save()
      await ev.save()

      return NextResponse.json({ success: true, rsvped: !isRsvped, count: ev.rsvps, citizen })
    }

    // Create new event
    const created = await CityEventModel.create(body)
    return NextResponse.json({ success: true, data: created })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

