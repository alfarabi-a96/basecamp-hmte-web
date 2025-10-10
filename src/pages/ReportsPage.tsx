import React, { useEffect, useState } from 'react'
import { Calendar, TrendingUp, Target } from 'lucide-react'
import { DocumentData } from 'firebase/firestore'
import { getSummary } from '../clients/firestore/firestoreAction'
import Loading from '../components/Loading'
import { calculateProgress, formatCurrency, transformDate } from '../utils'

const ReportsPage: React.FC = () => {
  const [summary, setSummary] = useState<DocumentData>({})
  const [isLoading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const summaryData = (await getSummary()) || {}

      setSummary(summaryData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const reportList = Object.entries(summary).map(([tahun, value]) => ({
    tahun,
    ...value
  }))

  return isLoading ? (
    <Loading />
  ) : (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='card p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Laporan Iuran Alumni
        </h1>
        <p className='text-gray-600'>
          Laporan lengkap kontribusi iuran alumni dari berbagai angkatan
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='card p-6 text-center'>
          <TrendingUp className='h-8 w-8 text-green-600 mx-auto mb-2' />
          <h3 className='text-lg font-semibold text-gray-900'>
            Total Dana Alumni
          </h3>
          <p className='text-2xl font-bold text-green-600'>
            {formatCurrency(summary?.[2025]?.total)}
          </p>
        </div>
        <div className='card p-6 text-center'>
          <Target className='h-8 w-8 text-blue-600 mx-auto mb-2' />
          <h3 className='text-lg font-semibold text-gray-900'>
            Target Tahun ini
          </h3>
          <p className='text-2xl font-bold text-blue-600'>
            {formatCurrency(summary?.[2025]?.target)}
          </p>
        </div>
      </div>

      {/* Yearly Reports */}
      <div className='space-y-6'>
        {reportList.map((list) => (
          <div key={list.tahun} className='card p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Laporan Tahun {list.tahun}
              </h2>
              <div className='flex items-center text-gray-500'>
                <Calendar className='h-4 w-4 mr-1' />
                <span className='text-sm'>
                  Update: {transformDate(list.lastUpdated.seconds)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-gray-700'>
                  Progress
                </span>
                <span className='text-sm text-gray-500'>
                  {calculateProgress(list.total, list.target)}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-blue-600 h-3 rounded-full transition-all duration-500'
                  style={{
                    width: `${calculateProgress(list.total, list.target)}%`
                  }}
                />
              </div>
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>{formatCurrency(list.total)}</span>
                <span>{formatCurrency(list.target)}</span>
              </div>
            </div>

            {/* Class Breakdown */}
            <div>
              <h3 className='text-sm font-medium text-gray-900 mb-3'>
                Kontribusi per Angkatan
              </h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full'>
                  <thead>
                    <tr className='border-b border-gray-200'>
                      <th className='text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase'>
                        Angkatan
                      </th>
                      <th className='text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase'>
                        Jumlah Iuran
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.angkatanList.map(
                      (angkatan: Record<string, number>) => (
                        <tr
                          key={angkatan.tahunAngkatan}
                          className='border-b border-gray-100'
                        >
                          <td className='py-3 px-3 text-sm font-medium text-gray-900'>
                            {angkatan.tahunAngkatan}
                          </td>
                          <td className='py-3 px-3 text-sm text-gray-900 text-right'>
                            {formatCurrency(angkatan.total)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportsPage
