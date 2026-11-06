import { MPageHeader } from '@/components/municipal/m-ui'
import { MissionBoard } from '@/components/municipal/mission-board'

export const metadata = { title: 'Ward Missions | Command Castle' }

export default function MissionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <MPageHeader title="Ward missions" subtitle="Every verified complaint becomes a timed mission. Beat the clock to earn ward points." />
      <MissionBoard />
    </div>
  )
}
