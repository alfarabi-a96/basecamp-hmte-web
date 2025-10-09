import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { getMenuItemsForRole } from '../../data/alumniData'
import { SidebarProps } from '../../types'
import {
  X,
  LayoutDashboard,
  FileText,
  Edit3,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react'

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  Edit3,
  Settings,
  User
}

interface IconComponentProps {
  iconName: string
  className?: string
}

const IconComponent: React.FC<IconComponentProps> = ({
  iconName,
  ...props
}) => {
  const Icon = iconMap[iconName] || LayoutDashboard
  return <Icon {...props} />
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = getMenuItemsForRole(user?.role || 'guest')
  const logoutText = isAdmin ? 'Logout' : 'Kembali'

  const handleLogout = (): void => {
    logout()
    navigate('/login')
  }

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:relative lg:z-0
      `}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          {!isCollapsed && (
            <div className='flex items-center space-x-3'>
              <div className='h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <FileText className='h-5 w-5 text-white' />
              </div>
              <div>
                <h1 className='font-bold text-gray-900 text-sm'>
                  Alumni Finance
                </h1>
                <p className='text-xs text-gray-500'>Laporan Iuran</p>
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className='hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
          >
            {isCollapsed ? (
              <ChevronRight className='h-4 w-4 text-gray-600' />
            ) : (
              <ChevronLeft className='h-4 w-4 text-gray-600' />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className='lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <X className='h-5 w-5 text-gray-600' />
          </button>
        </div>

        {/* User Info */}
        <div
          className={`p-4 border-b border-gray-200 ${isCollapsed ? 'px-2' : ''}`}
        >
          <div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
          >
            <div className='h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center'>
              <User className='h-5 w-5 text-gray-600' />
            </div>
            {!isCollapsed && (
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {user?.name || 'User'}
                </p>
                <p className='text-xs text-gray-500 capitalize'>
                  {user?.role === 'admin' ? 'Administrator' : 'Guest'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className='flex-1 p-2 space-y-1'>
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item group ${isActive ? 'active' : ''} ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`
              }
              onClick={() => setIsOpen(false)} // Close mobile sidebar on navigation
            >
              <IconComponent
                iconName={item.icon}
                className='h-5 w-5 flex-shrink-0'
              />
              {!isCollapsed && (
                <span className='text-sm font-medium ml-2'>{item.title}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50'>
                  {item.title}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className='p-2 border-t border-gray-200'>
          <button
            onClick={handleLogout}
            className={`sidebar-item w-full group text-red-600 hover:text-red-700 hover:bg-red-50 ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut className='h-5 w-5 flex-shrink-0' />
            {!isCollapsed && (
              <span className='text-sm font-medium ml-2'>{logoutText}</span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50'>
                {logoutText}
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
