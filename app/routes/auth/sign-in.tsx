import { redirectIfAuthenticated } from '~/lib/auth'
import SignInPage from '~/pages/auth/sign-in'

export function meta() {
  return [{ title: 'GalaCash | Sign In' }]
}

export async function clientLoader() {
  // Redirect if already authenticated
  await redirectIfAuthenticated()
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

export default function SignIn() {
  return <SignInPage />
}
