// User and Authentication Types
export interface User {
  id: string | number
  username: string
  role: UserRole
  name: string
}

export type UserRole = 'admin' | 'guest' | 'unauthenticated'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  error?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<LoginResponse>
  loginAsGuest: () => void
  logout: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  isGuest: () => boolean
  USER_ROLES: {
    ADMIN: string
    GUEST: string
    UNAUTHENTICATED: string
  }
}

// Alumni Data Types
export interface ClassData {
  className: string
  collected: number
  contributors: number
  totalAlumni: number
}

export interface YearlyContribution {
  year: number
  target: number
  collected: number
  contributors: number
  totalAlumni: number
  lastUpdated: string
  byClass: ClassData[]
}

export interface GrandTotal {
  totalCollected: number
  totalTarget: number
  totalContributors: number
  totalAlumni: number
  averagePerYear: number
}

export interface AlumniData {
  contributionsByYear: YearlyContribution[]
  grandTotal: GrandTotal
}

export interface MenuItem {
  id: string
  title: string
  path: string
  icon: string
  requiredRole?: UserRole[]
}

// Component Props Types
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export interface HeaderProps {
  onMenuClick: () => void
}

export interface ProgressBarProps {
  current: number
  target: number
  label: string
  showPercentage?: boolean
}

export interface StatCardProps {
  title: string
  value: string
  icon: React.ComponentType<any>
  color?: string
  subtitle?: string
}

// Form Types
export interface FormData {
  username: string
  password: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
