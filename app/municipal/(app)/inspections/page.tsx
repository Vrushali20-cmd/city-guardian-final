import { MPageHeader } from '@/components/municipal/m-ui'
import { InspectionList } from '@/components/municipal/inspection-list'

export const metadata = { title: 'Inspections | Command Castle' }

export default function InspectionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <MPageHeader title="Inspection desk" subtitle="Compare before and after evidence. Approve the fix or send it back for rework." />
      <InspectionList />
    </div>
  )
}
