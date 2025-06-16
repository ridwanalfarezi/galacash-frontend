'use client'

import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
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

const navigation = [
  { name: 'Dashboard', href: '/user/dashboard', icon: Icons.Home },
  { name: 'Kas Kelas', href: '/kas-kelas', icon: Icons.Money },
  { name: 'Aju Dana', href: '/aju-dana', icon: Icons.LowIncomeLevel },
]

const mockUser = {
  name: 'Fathya Khairani R',
  role: 'Bendahara',
  avatar: '/placeholder.svg?height=40&width=40',
}

export function Sidebar() {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={`flex flex-col rounded-tr-4xl rounded-br-4xl bg-white shadow-lg transition-[width] duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="p-6">
        <img src="/logo.png" alt="Logo" className={sidebarCollapsed ? 'w-auto' : 'w-40'} />
      </div>

      {/* Collapse Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className={`w-full cursor-pointer ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start px-4'} hover:bg-gray-50`}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <Icons.CloseSidebar />
          {!sidebarCollapsed && <span className="ml-2 text-2xl">Collapsed</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.name} to={item.href} className="block">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full cursor-pointer ${
                    sidebarCollapsed ? 'justify-center px-2' : 'justify-start px-4'
                  } ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-900'} hover:bg-blue-50 hover:text-blue-700`}
                >
                  <item.icon size={24} />
                  {!sidebarCollapsed && (
                    <span className="ml-2 text-xl xl:text-2xl">{item.name}</span>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className={`flex p-4 ${sidebarCollapsed ? 'items-center' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="h-auto w-full cursor-pointer p-0">
              <div
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mockUser.avatar} />
                  <AvatarFallback>FK</AvatarFallback>
                </Avatar>

                {!sidebarCollapsed && (
                  <>
                    <div className="flex flex-1 flex-col text-left">
                      <span className="text-sm font-medium">{mockUser.name}</span>
                      <span className="text-xs text-gray-700">{mockUser.role}</span>
                    </div>
                    <ChevronUp size={20} />
                  </>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-auto sm:w-[200px]">
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-200">
              <Icons.Settings className="mr-2 text-gray-900" />
              <span className="text-base font-normal text-gray-900">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="cursor-pointer hover:bg-red-50">
              <Icons.SignOut className="mr-2 text-red-900" />
              <span className="text-base font-normal text-red-900">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
