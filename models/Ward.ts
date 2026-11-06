import mongoose, { Schema, model, models } from 'mongoose'

export interface IWard {
  id: string
  official: string
  game: string
  area: string
  points: number
  resolved: number
  pending: number
  avgDays: number
  lat: number
  lng: number
}

const WardSchema = new Schema<IWard>(
  {
    id: { type: String, required: true, unique: true },
    official: { type: String, required: true },
    game: { type: String, required: true },
    area: { type: String, required: true },
    points: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    avgDays: { type: Number, default: 2.5 },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true },
)

export const WardModel = models.Ward || model<IWard>('Ward', WardSchema)

