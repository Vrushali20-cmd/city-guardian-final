import { MPageHeader } from '@/components/municipal/m-ui'
import { PartnerApprovals } from '@/components/municipal/approvals'

export const metadata = { title: 'Partner Approvals | Command Castle' }

export default function PartnersPage() {
  return (
    <div className="flex flex-col gap-8">
      <MPageHeader title="Partner approvals" subtitle="Verify cafes, restaurants and CSR organisations before they join the reward kingdom." />
      <PartnerApprovals />
    </div>
  )
}
