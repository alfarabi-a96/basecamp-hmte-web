import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType, UserRole, LoginResponse } from '../types'

// Types untuk user
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  GUEST: 'guest' as const,
  UNAUTHENTICATED: 'unauthenticated' as const
}

interface DummyUser {
  id: number
  username: string
  password: string
  role: UserRole
  name: string
}

// Dummy users untuk testing
const DUMMY_USERS: Record<string, DummyUser> = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: USER_ROLES.ADMIN,
    name: 'Administrator'
  }
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

// Custom hook untuk menggunakan auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Check localStorage saat pertama kali load
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (username: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check credentials
    const foundUser = Object.values(DUMMY_USERS).find(
      u => u.username === username && u.password === password
    )

    if (foundUser) {
      const userSession: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name
      }
      
      setUser(userSession)
      localStorage.setItem('auth_user', JSON.stringify(userSession))
      setIsLoading(false)
      return { success: true }
    } else {
      setIsLoading(false)
      return { success: false, error: 'Username atau password salah' }
    }
  }

  // Login as guest
  const loginAsGuest = (): void => {
    const guestUser: User = {
      id: 'guest',
      username: 'guest',
      role: USER_ROLES.GUEST,
      name: 'Guest User'
    }
    
    setUser(guestUser)
    localStorage.setItem('auth_user', JSON.stringify(guestUser))
  }

  // Logout function
  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return user !== null && user.role !== USER_ROLES.UNAUTHENTICATED
  }

  // Check if user is admin
  const isAdmin = (): boolean => {
    return user !== null && user.role === USER_ROLES.ADMIN
  }

  // Check if user is guest
  const isGuest = (): boolean => {
    return user !== null && user.role === USER_ROLES.GUEST
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    loginAsGuest,
    logout,
    isAuthenticated,
    isAdmin,
    isGuest,
    USER_ROLES
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
