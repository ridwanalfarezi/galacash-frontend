import { Icons } from '~/components/icons'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number }>
}

export const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/user/dashboard', icon: Icons.Home },
  { name: 'Kas Kelas', href: '/user/kas-kelas', icon: Icons.Money },
  { name: 'Aju Dana', href: '/user/aju-dana', icon: Icons.LowIncomeLevel },
]

export const mockUser = {
  name: 'Fathya Khairani R',
  role: 'Bendahara',
  avatar: '/placeholder.svg?height=40&width=40',
}
