import AjuDanaPage from '~/pages/user/aju-dana'
import type { Route } from './+types/dashboard'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'GalaCash | Aju Dana' }]
}

export default function AjuDana() {
  return <AjuDanaPage />
}
