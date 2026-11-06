import mongoose, { Schema, model, models } from 'mongoose'

export interface IComplaint {
  id: string
  title: string
  category: string
  severity: string
  status: string
  wardId: string
  image: string
  afterImage?: string
  location: string
  lat: number
  lng: number
  reportedBy: string
  reportedAt: string
  deadline: string
  upvotes: number
  description: string
  ai: {
    confidence: number
    approach: string
    effort: string
    timeline: string
    similar: string
  }
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: String, required: true, default: 'reported' },
    wardId: { type: String, required: true },
    image: { type: String, required: true },
    afterImage: { type: String },
    location: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    reportedBy: { type: String, required: true },
    reportedAt: { type: String, required: true },
    deadline: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    description: { type: String, default: '' },
    ai: {
      confidence: { type: Number, default: 90 },
      approach: { type: String, default: '' },
      effort: { type: String, default: '' },
      timeline: { type: String, default: '' },
      similar: { type: String, default: '' },
    },
  },
  { timestamps: true },
)

export const ComplaintModel = models.Complaint || model<IComplaint>('Complaint', ComplaintSchema)

