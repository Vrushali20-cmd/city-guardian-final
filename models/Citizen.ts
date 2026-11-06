import mongoose, { Schema, model, models } from 'mongoose'

export interface ICitizen {
  name: string
  email: string
  ward: string
  zone: string
  points: number
  gems: number
  elixir: number
  clan: string
  clanRole: string
  clanTrophies: number
  townHallLevel: number
  level: number
  xp: number
  avatar: string
  title: string
  badges: string[]
  redeemedCoupons: Array<{
    id: string
    couponId: string
    title: string
    partner: string
    code: string
    cost: number
    redeemedAt: string
    category: string
    status: 'active' | 'used'
  }>
  rsvpedEventIds: string[]
}

const CitizenSchema = new Schema<ICitizen>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ward: { type: String, default: 'Ward 7' },
    zone: { type: String, default: 'Zone 2' },
    points: { type: Number, default: 420 },
    gems: { type: Number, default: 75 },
    elixir: { type: Number, default: 450 },
    clan: { type: String, default: 'Holkar Heroes' },
    clanRole: { type: String, default: 'Co-Leader' },
    clanTrophies: { type: Number, default: 1840 },
    townHallLevel: { type: Number, default: 8 },
    level: { type: Number, default: 7 },
    xp: { type: Number, default: 68 },
    avatar: { type: String, default: 'mario' },
    title: { type: String, default: 'Master Pothole Smasher' },
    badges: { type: [String], default: [] },
    redeemedCoupons: { type: [Schema.Types.Mixed], default: [] },
    rsvpedEventIds: { type: [String], default: [] },
  },
  { timestamps: true },
)

export const CitizenModel = models.Citizen || model<ICitizen>('Citizen', CitizenSchema)

