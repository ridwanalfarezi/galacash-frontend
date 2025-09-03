import type { ComponentProps } from 'react'

import { Icons } from '~/components/icons'

export interface NavigationItem {
  name: string
  href: string
  className: string
  icon: React.ComponentType<ComponentProps<'svg'>>
}

export const navigationUser: NavigationItem[] = [
  { name: 'Beranda', href: '/user/dashboard', icon: Icons.Home, className: 'size-8' },
  { name: 'Kas Kelas', href: '/user/kas-kelas', icon: Icons.Notebook, className: 'size-6' },
  { name: 'Aju Dana', href: '/user/aju-dana', icon: Icons.LowIncomeLevel, className: 'size-8' },
  { name: 'Tagihan Kas', href: '/user/tagihan-kas', icon: Icons.TagihanKas, className: 'size-6' },
]
export const navigationBendahara: NavigationItem[] = [
  { name: 'Beranda', href: '/bendahara/dashboard', icon: Icons.Home, className: 'size-8' },
  { name: 'Kas Kelas', href: '/bendahara/kas-kelas', icon: Icons.Notebook, className: 'size-6' },
  {
    name: 'Aju Dana',
    href: '/bendahara/aju-dana',
    icon: Icons.LowIncomeLevel,
    className: 'size-8',
  },
  {
    name: 'Rekap Kas',
    href: '/bendahara/rekap-kas',
    icon: Icons.TagihanKas,
    className: 'size-6',
  },
]

export const mockBendahara = {
  name: 'Fathya Khairani R',
  role: 'bendahara',
  email: 'fathya@example.com',
  avatar: '/patya.png',
}

export const mockUser = {
  name: 'Ridwan Alfarezi',
  role: 'user',
  nim: '1313624020',
  avatar: '/patya.png',
}
