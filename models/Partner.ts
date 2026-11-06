import mongoose, { Schema, model, models } from 'mongoose'

export interface IPartner {
  id: string
  name: string
  type: string
  coupons: number
  redemptions: number
  events: number
  impact: number
  status: string
  image: string
}

const PartnerSchema = new Schema<IPartner>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    coupons: { type: Number, default: 0 },
    redemptions: { type: Number, default: 0 },
    events: { type: Number, default: 0 },
    impact: { type: Number, default: 0 },
    status: { type: String, default: 'pending' },
    image: { type: String, required: true },
  },
  { timestamps: true },
)

export const PartnerModel = models.Partner || model<IPartner>('Partner', PartnerSchema)

