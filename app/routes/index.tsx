import { redirect } from 'react-router'

export function loader() {
  // Redirect all requests to the root path to /user/dashboard
  return redirect('/user/dashboard')
}

export default function Index() {
  // This component should never be rendered due to the redirect
  return null
}
