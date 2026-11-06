import { MPageHeader } from '@/components/municipal/m-ui'
import { ComplaintQueue } from '@/components/municipal/complaint-queue'

export const metadata = { title: 'Complaint Queue | Command Castle' }

export default function MunicipalComplaintsPage() {
  return (
    <div className="flex flex-col gap-8">
      <MPageHeader title="Complaint queue" subtitle="Verify, reject or assign AI-analyzed citizen reports." />
      <ComplaintQueue />
    </div>
  )
}
