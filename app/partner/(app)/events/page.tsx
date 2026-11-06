import { EventManager } from '@/components/portal/event-manager'
import { CPageHeader } from '@/components/citizen/c-ui'

export const metadata = { title: 'Sponsored Events | Partner Kingdom' }

export default function PartnerEventsPage() {
  return (
    <div className="flex flex-col gap-8 text-ink">
      <CPageHeader
        title="Host & Sponsor Community Drives"
        subtitle="Organize weekend cleanliness drives, segregation workshops, or tree plantation events at your venue."
      />
      <EventManager
        host="Chhappan Brew Co."
        dark={false}
        kinds={['Drive', 'Plantation', 'Workshop']}
        accent="bg-coin text-ink"
      />
    </div>
  )
}

