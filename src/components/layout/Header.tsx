import React from 'react'
import { Menu, Bell, User } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { HeaderProps } from '../../types'

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, isAdmin } = useAuth()

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 px-4 py-3'>
      <div className='flex items-center justify-between'>
        {/* Left Side - Menu Button & Title */}
        <div className='flex items-center space-x-4'>
          <button
            onClick={onMenuClick}
            className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <Menu className='h-5 w-5 text-gray-600' />
          </button>

          <div>
            <h1 className='text-xl font-semibold text-gray-900'>
              Dashboard Laporan Keuangan
            </h1>
            <p className='text-sm text-gray-500'>Sistem Iuran Alumni</p>
          </div>
        </div>

        {/* Right Side - User Info & Actions */}
        <div className='flex items-center space-x-4'>
          {/* User Menu */}
          <div className='flex items-center space-x-3 pl-4 border-l border-gray-200'>
            <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='h-4 w-4 text-blue-600' />
            </div>
            <div className='hidden sm:block'>
              <p className='text-sm font-medium text-gray-900'>
                {user?.name || 'User'}
              </p>
              <p className='text-xs text-gray-500'>
                {isAdmin ? 'Administrator' : 'Guest User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
