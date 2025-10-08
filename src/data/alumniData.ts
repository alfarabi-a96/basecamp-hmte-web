import { AlumniData, MenuItem, UserRole, YearlyContribution } from '../types'

// Dummy data untuk laporan keuangan alumni
export const alumniData: AlumniData = {
  contributionsByYear: [
    {
      year: 2024,
      target: 50000000, // 50 juta
      collected: 38500000, // 38.5 juta
      contributors: 85,
      totalAlumni: 120,
      lastUpdated: '5 Oktober 2024',
      byClass: [
        {
          className: 'Angkatan 2020',
          collected: 8500000,
          contributors: 17,
          totalAlumni: 25
        },
        {
          className: 'Angkatan 2019',
          collected: 9200000,
          contributors: 23,
          totalAlumni: 30
        },
        {
          className: 'Angkatan 2018',
          collected: 10800000,
          contributors: 22,
          totalAlumni: 32
        },
        {
          className: 'Angkatan 2017',
          collected: 10000000,
          contributors: 23,
          totalAlumni: 33
        }
      ]
    },
    {
      year: 2023,
      target: 45000000, // 45 juta
      collected: 42300000, // 42.3 juta
      contributors: 92,
      totalAlumni: 115,
      lastUpdated: '31 Desember 2023',
      byClass: [
        {
          className: 'Angkatan 2019',
          collected: 11200000,
          contributors: 25,
          totalAlumni: 30
        },
        {
          className: 'Angkatan 2018',
          collected: 12800000,
          contributors: 28,
          totalAlumni: 32
        },
        {
          className: 'Angkatan 2017',
          collected: 11500000,
          contributors: 25,
          totalAlumni: 33
        },
        {
          className: 'Angkatan 2016',
          collected: 6800000,
          contributors: 14,
          totalAlumni: 20
        }
      ]
    },
    {
      year: 2022,
      target: 40000000, // 40 juta
      collected: 39800000, // 39.8 juta
      contributors: 78,
      totalAlumni: 100,
      lastUpdated: '31 Desember 2022',
      byClass: [
        {
          className: 'Angkatan 2018',
          collected: 13200000,
          contributors: 24,
          totalAlumni: 32
        },
        {
          className: 'Angkatan 2017',
          collected: 14800000,
          contributors: 28,
          totalAlumni: 33
        },
        {
          className: 'Angkatan 2016',
          collected: 11800000,
          contributors: 26,
          totalAlumni: 35
        }
      ]
    }
  ],
  grandTotal: {
    totalCollected: 120600000, // Total dari semua tahun
    totalTarget: 135000000,
    totalContributors: 255,
    totalAlumni: 335,
    averagePerYear: 40200000
  }
}

// Helper functions
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

export const getCurrentYearData = (): YearlyContribution => {
  return alumniData.contributionsByYear[0] // Data tahun terbaru
}

// Menu items berdasarkan role
export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  const baseMenu: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard'
    },
    {
      id: 'reports',
      title: 'Laporan Iuran',
      path: '/reports',
      icon: 'FileText'
    }
  ]

  if (role === 'admin') {
    baseMenu.push({
      id: 'edit-reports',
      title: 'Edit Laporan',
      path: '/edit-reports',
      icon: 'Edit3',
      requiredRole: ['admin']
    })
  }

  return baseMenu
}
