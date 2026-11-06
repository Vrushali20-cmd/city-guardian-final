import mongoose, { Schema, model, models } from 'mongoose'

export interface ICoupon {
  id: string
  partner: string
  title: string
  cost: number
  stock: number
  category: string
  expiry: string
  image: string
  review?: string
}

const CouponSchema = new Schema<ICoupon>(
  {
    id: { type: String, required: true, unique: true },
    partner: { type: String, required: true },
    title: { type: String, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    expiry: { type: String, required: true },
    image: { type: String, required: true },
    review: { type: String, default: 'verified' },
  },
  { timestamps: true },
)

export const CouponModel = models.Coupon || model<ICoupon>('Coupon', CouponSchema)

