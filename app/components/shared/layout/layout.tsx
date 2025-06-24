import { Outlet } from 'react-router'

import { BottomBar } from './bottombar'
import { Sidebar } from './sidebar'

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <Outlet />
      </div>
      <BottomBar />
    </div>
  )
}

export default AppLayout
