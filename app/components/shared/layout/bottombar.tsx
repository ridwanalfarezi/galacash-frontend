'use client'

import { Link, useLocation, useNavigate } from 'react-router'

import { Icons } from '~/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

import { mockUser, navigation } from './navdata'

export function BottomBar() {
  const location = useLocation()

  const navigate = useNavigate()

  const signOut = () => {
    // Implement sign out logic here
    console.log('User signed out')
    navigate('/sign-in')
  }

  return (
    <div className="border- t fixed bottom-0 z-50 block w-full border-gray-200 bg-white md:hidden">
      <nav className="flex h-16 items-center justify-evenly">
        {navigation.map((item) => {
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
              <item.icon size={24} />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback>FK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto sm:w-[200px]">
            <Link to="/user/settings">
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-200">
                <Icons.Settings className="mr-2 text-gray-900" />
                <span className="text-base font-normal text-gray-900">Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="cursor-pointer hover:bg-red-50" onClick={signOut}>
              <Icons.SignOut className="mr-2 text-red-900" />
              <span className="text-base font-normal text-red-900">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}
