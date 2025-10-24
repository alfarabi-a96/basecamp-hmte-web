import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType, LoginResponse } from '../types'
import { loginUser, logoutUser } from '../interfaces/userApi'

// Create context
export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const EXPIRATION_HOURS = 3 // token berlaku 3 jam

  // Cek localStorage saat pertama kali load
  useEffect(() => {
    const savedData = localStorage.getItem('auth_user')

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)

        // Cek apakah ada expiry timestamp dan apakah sudah kadaluarsa
        if (parsed.expiry && Date.now() > parsed.expiry) {
          console.warn('Token expired, clearing session...')
          localStorage.removeItem('auth_user')
          setUser(null)
        } else {
          setUser(parsed.user)
        }
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    setIsLoading(true)
    try {
      const user = await loginUser(username, password)
      const userSession: User = {
        username: user.email || '',
        name: user.displayName || 'testing login',
        role: 'admin'
      }

      // Simpan user + waktu expired
      const expiryTime = Date.now() + EXPIRATION_HOURS * 60 * 60 * 1000
      localStorage.setItem(
        'auth_user',
        JSON.stringify({ user: userSession, expiry: expiryTime })
      )

      setUser(userSession)
      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: 'Username atau password salah' }
    }
  }

  // Login as guest
  const loginAsGuest = (): void => {
    const guestUser: User = {
      username: 'guest',
      name: 'uda / uni alumni',
      role: 'guest'
    }

    const expiryTime = Date.now() + EXPIRATION_HOURS * 60 * 60 * 1000
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ user: guestUser, expiry: expiryTime })
    )
    setUser(guestUser)
  }

  // Logout function
  const logout = async (): Promise<void> => {
    await logoutUser()
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const value: AuthContextType = {
    user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    loginAsGuest,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
