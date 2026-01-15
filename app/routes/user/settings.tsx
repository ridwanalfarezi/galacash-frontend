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

export function HydrateFallback() {
  return (
    <div className="flex justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  )
}

export default function Settings() {
  return <SettingsPage />
}
