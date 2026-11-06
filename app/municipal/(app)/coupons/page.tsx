import { MPageHeader } from '@/components/municipal/m-ui'
import { CouponApprovals } from '@/components/municipal/approvals'

export const metadata = { title: 'Coupon Approvals | Command Castle' }

export default function CouponsPage() {
  return (
    <div className="flex flex-col gap-8">
      <MPageHeader title="Coupon approvals" subtitle="Review partner reward coupons before they appear in the citizen shop." />
      <CouponApprovals />
    </div>
  )
}
