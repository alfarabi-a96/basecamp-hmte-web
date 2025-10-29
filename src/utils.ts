import { MenuItem } from './types'

export const transformDate = (data: number) => {
  const date = new Date(data * 1000)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const calculateProgress = (current: number, target: number): number => {
  return Math.round((current / target) * 100)
}

export const getMenuItemsForRole = (role: string): MenuItem[] => {
  const baseMenu: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard'
    },
    // {
    //   id: 'reports',
    //   title: 'Laporan Iuran',
    //   path: '/reports',
    //   icon: 'FileText'
    // }
  ]

  if (role === 'admin') {
    baseMenu.push({
      id: 'edit-reports',
      title: 'Edit Laporan',
      path: '/edit-reports',
      icon: 'Edit3'
    })
  }

  return baseMenu
}

export const transformCurrentYear = () => {
  return new Date().getFullYear()
}
