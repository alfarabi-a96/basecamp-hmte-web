import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ProtectedRouteProps } from '../types'

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  // if (user.role === 'admin') {
  //   return <Navigate to="/dashboard" replace />
  // }

  return <>{children}</>
}

export default ProtectedRoute
