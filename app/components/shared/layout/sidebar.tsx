'use client'

import { ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { Icons } from '~/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

import {
  mockBendahara,
  mockUser,
  navigationBendahara,
  navigationUser,
  type NavigationItem,
} from './navdata'

export function Sidebar() {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const signOut = () => {
    // Implement sign out logic here
    console.log('User signed out')
    navigate('/sign-in')
  }

  const navigation: NavigationItem[] = location.pathname.startsWith('/bendahara')
    ? navigationBendahara
    : navigationUser

  const user = location.pathname.startsWith('/bendahara') ? mockBendahara : mockUser

  return (
    <TooltipProvider>
      <div
        className={`md:p hidden flex-col rounded-tr-4xl rounded-br-4xl bg-white shadow-lg transition-[width] duration-300 ease-in-out md:flex ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        <div className="p-6">
          <img src="/logo.png" alt="Logo" className={sidebarCollapsed ? 'w-auto' : 'w-40'} />
        </div>

        <div className="p-4">
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full cursor-pointer justify-center px-2 hover:bg-gray-50"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <Icons.CloseSidebar className="size-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Perluas</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full cursor-pointer justify-start gap-4 px-4 hover:bg-gray-50"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Icons.CloseSidebar className="size-8" />
              <span className="text-2xl">Ciutkan</span>
            </Button>
          )}
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-4">
            {navigation.map((item: NavigationItem) => {
              const isActive = location.pathname.includes(item.href)
              return (
                <Link key={item.name} to={item.href} className="block">
                  {sidebarCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? 'default' : 'ghost'}
                          className={`w-full cursor-pointer justify-center px-2 ${isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-900'} hover:bg-blue-50 hover:text-blue-500`}
                        >
                          <div className="flex size-6 items-center justify-center">
                            <item.icon className={item.className} />
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full cursor-pointer justify-start gap-4 px-4 ${isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-900'} hover:bg-blue-50 hover:text-blue-500`}
                    >
                      <div className="flex size-6 items-center justify-center">
                        <item.icon className={item.className} />
                      </div>
                      {/* <item.icon className={item.className} /> */}
                      <span className="text-xl xl:text-2xl">{item.name}</span>
                    </Button>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className={`flex p-4 ${sidebarCollapsed ? 'items-center' : ''}`}>
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="h-auto w-full cursor-pointer p-0">
                      <div className="flex items-center justify-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>FK</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-auto sm:w-[200px]">
                    <Link to={`/${user.role}/settings`}>
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-200">
                        <Icons.Settings className="mr-2 h-5 w-5 text-gray-900" />
                        <span className="text-base font-normal text-gray-900">Pengaturan</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-red-50" onClick={signOut}>
                      <Icons.SignOut className="mr-2 h-5 w-5 text-red-900" />
                      <span className="text-base font-normal text-red-900">Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-auto w-full cursor-pointer p-0">
                  <div className="flex items-center justify-between gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>FK</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col text-left">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-gray-700">
                        {user.role === 'bendahara'
                          ? 'email' in user
                            ? user.email
                            : ''
                          : 'nim' in user
                            ? user.nim
                            : ''}
                      </span>
                    </div>
                    <ChevronUp size={20} />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto sm:w-[200px]">
                <Link to={`/${user.role}/settings`}>
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
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
