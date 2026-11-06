import mongoose, { Schema, model, models } from 'mongoose'

export interface ICityEvent {
  id: string
  title: string
  host: string
  date: string
  place: string
  points: number
  rsvps: number
  image: string
  kind: string
}

const CityEventSchema = new Schema<ICityEvent>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    host: { type: String, required: true },
    date: { type: String, required: true },
    place: { type: String, required: true },
    points: { type: Number, default: 0 },
    rsvps: { type: Number, default: 0 },
    image: { type: String, required: true },
    kind: { type: String, required: true },
  },
  { timestamps: true },
)

export const CityEventModel = models.CityEvent || model<ICityEvent>('CityEvent', CityEventSchema)

