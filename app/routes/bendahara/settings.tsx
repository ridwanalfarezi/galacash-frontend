import { requireRole } from '~/lib/auth'
import SettingsPage from '~/pages/shared/settings'

export function meta() {
  return [{ title: 'GalaCash | Settings' }]
}

export async function clientLoader() {
  await requireRole('bendahara')
  return null
}

clientLoader.hydrate = true

export default function Settings() {
  return <SettingsPage />
}
