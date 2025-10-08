import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const handleMenuClick = (): void => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        {/* Content Area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
