import { MPageHeader } from '@/components/municipal/m-ui'
import { EventManager } from '@/components/portal/event-manager'

export const metadata = { title: 'Events & Notices | Command Castle' }

export default function MunicipalEventsPage() {
  return (
    <div className="flex flex-col gap-8">
      <MPageHeader title="Events & notices" subtitle="Broadcast drives, notices and awareness campaigns to every ward." />
      <EventManager host="Nagar Nigam" dark kinds={['Drive', 'Notice', 'Workshop', 'Plantation']} accent="bg-coin text-ink" />
    </div>
  )
}
