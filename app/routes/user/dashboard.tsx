import DashboardPage from '~/pages/user/dashboard'
import type { Route } from './+types/dashboard'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'GalaCash | Dashboard' }]
}

export default function Dashboard() {
  return <DashboardPage />
}
