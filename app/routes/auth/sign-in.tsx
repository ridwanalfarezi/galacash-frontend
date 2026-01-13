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

export default function SignIn() {
  return <SignInPage />
}
