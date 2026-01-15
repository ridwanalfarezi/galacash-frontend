import { requireAuth } from '~/lib/auth'
import SettingsPage from '~/pages/shared/settings'

export function meta() {
  return [{ title: 'GalaCash | Settings' }]
}

export async function clientLoader() {
  await requireAuth()
  return null
}

clientLoader.hydrate = true

export default function Settings() {
  return <SettingsPage />
}
