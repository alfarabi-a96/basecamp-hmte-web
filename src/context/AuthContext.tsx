import React, {
  createContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
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

      setUser(userSession)
      localStorage.setItem('auth_user', JSON.stringify(userSession))
      setIsLoading(false)
      return { success: true }
    } catch (erorr) {
      setIsLoading(false)
      return { success: false, error: 'Username atau password salah' }
    }
  }

  // Login as guest
  const loginAsGuest = (): void => {
    const guestUser: User = {
      username: 'guest',
      name: 'Guest User',
      role: 'guest'
    }

    setUser(guestUser)
    localStorage.setItem('auth_user', JSON.stringify(guestUser))
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
