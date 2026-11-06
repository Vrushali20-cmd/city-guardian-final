import { COMPLAINTS } from '@/lib/data'
import { CitizenComplaintDetailClient } from './detail-client'

export function generateStaticParams() {
  return COMPLAINTS.map((c) => ({ id: c.id }))
}

export default async function CitizenComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CitizenComplaintDetailClient id={id} />
}

