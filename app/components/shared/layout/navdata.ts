import type { ComponentProps } from 'react'

import { Icons } from '~/components/icons'

interface NavigationItem {
  name: string
  href: string
  className: string
  icon: React.ComponentType<ComponentProps<'svg'>>
}

export const navigation: NavigationItem[] = [
  { name: 'Beranda', href: '/dashboard', icon: Icons.Home, className: 'size-8' },
  { name: 'Kas Kelas', href: '/kas-kelas', icon: Icons.Notebook, className: 'size-6' },
  { name: 'Aju Dana', href: '/aju-dana', icon: Icons.LowIncomeLevel, className: 'size-8' },
  { name: 'Tagihan Kas', href: '/tagihan-kas', icon: Icons.TagihanKas, className: 'size-6' },
]

export const mockBendahara = {
  name: 'Fathya Khairani R',
  role: 'bendahara',
  nim: '1313624099',
  avatar: '/patya.png',
}

export const mockUser = {
  name: 'Ridwan Alfarezi',
  role: 'user',
  nim: '1313624020',
  avatar: '/patya.png',
}
