'use client'

import { Link, useLocation } from 'react-router'

import { Icons } from '~/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useLogout } from '~/lib/queries/auth.queries'
import { useUserProfile } from '~/lib/queries/user.queries'
import { cn } from '~/lib/utils'

import { navigationBendahara, navigationUser, type NavigationItem } from './navdata'

export function BottomBar() {
  const location = useLocation()
  const { data: user } = useUserProfile()
  const logoutMutation = useLogout()

  const signOut = () => {
    logoutMutation.mutate()
  }

  const navigation: NavigationItem[] = location.pathname.startsWith('/bendahara')
    ? navigationBendahara
    : navigationUser

  const userInitials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  return (
    <div className="fixed bottom-0 z-50 block w-full border-t border-gray-200 bg-white md:hidden">
      <nav className="flex h-16 items-center justify-evenly">
        {navigation.map((item: NavigationItem) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                isActive ? 'text-blue-500' : 'text-gray-900 hover:text-blue-500'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto sm:w-50">
            <Link to={`/${user?.role}/settings`}>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-200">
                <Icons.Settings className="mr-2 text-gray-900" />
                <span className="text-base font-normal text-gray-900">Pengaturan</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="cursor-pointer hover:bg-red-50" onClick={signOut}>
              <Icons.SignOut className="mr-2 text-red-900" />
              <span className="text-base font-normal text-red-900">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}
