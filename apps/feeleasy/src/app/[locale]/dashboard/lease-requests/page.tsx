import DashboardLeaseRequest from '@components-page/dashboard-lease-requests'

export default async function LeaseRequests() {
  return (
    <article className="lease-request-page" id="lease-request-page">
      <DashboardLeaseRequest />
    </article>
  )
}
