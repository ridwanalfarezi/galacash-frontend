import type { ComponentProps } from 'react'

import { Icons } from '~/components/icons'

interface NavigationItem {
  name: string
  href: string
  className: string
  icon: React.ComponentType<ComponentProps<'svg'>>
}

export const navigation: NavigationItem[] = [
  { name: 'Beranda', href: '/user/dashboard', icon: Icons.Home, className: 'size-8' },
  { name: 'Kas Kelas', href: '/user/kas-kelas', icon: Icons.Notebook, className: 'size-6' },
  { name: 'Aju Dana', href: '/user/aju-dana', icon: Icons.LowIncomeLevel, className: 'size-8' },
  { name: 'Tagihan Kas', href: '/user/tagihan-kas', icon: Icons.TagihanKas, className: 'size-6' },
]

export const mockUser = {
  name: 'Fathya Khairani R',
  role: 'Bendahara',
  avatar: '/patya.png',
}
