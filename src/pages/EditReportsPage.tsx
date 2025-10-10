import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Edit, X } from 'lucide-react'
import { DocumentData } from 'firebase/firestore'
import {
  getYearMeta,
  updateAngkatanAndIuranTotal
} from '../clients/firestore/firestoreAction'
import Loading from '../components/Loading'
import { formatCurrency } from '../utils'

const EditReportsPage: React.FC = () => {
  const [meta, setMeta] = useState<DocumentData | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [jumlahIuran, setJumlahIuran] = useState<string>('')
  const [showEditForm, setShowEditForm] = useState<Record<string, number>>({
    angkatan: 0
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const metaData = await getYearMeta('2025')

      setMeta(metaData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (showEditForm.angkatan !== 0)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
  }, [showEditForm.angkatan])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { value } = e.target
    setJumlahIuran(value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateAngkatanAndIuranTotal(
        '2025',
        showEditForm.angkatan,
        Number(jumlahIuran)
      )

      await fetchData()

      alert('Data berhasil diperbarui!')
    } catch (error) {
      alert('Gagal memperbarui data!')
    } finally {
      setJumlahIuran('')
      setShowEditForm({ angkatan: 0 })
      setLoading(false)
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='card p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Edit Laporan Iuran
            </h1>
            <p className='text-gray-600'>
              Kelola data iuran alumni dan angkatan
            </p>
          </div>
          {/* <button
            onClick={() => setShowAddForm(true)}
            className='btn-primary flex items-center space-x-2'
          >
            <Plus className='h-4 w-4' />
            <span>Tambah Data</span>
          </button> */}
        </div>
      </div>

      {/* Add Form */}
      {showEditForm.angkatan !== 0 && (
        <div className='card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Update Data Iuran Angkatan {showEditForm.angkatan}
            </h2>
            <button
              onClick={() =>
                setShowEditForm({
                  angkatan: 0
                })
              }
              className='p-2 hover:bg-gray-100 rounded-lg'
            >
              <X className='h-4 w-4' />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            {/* <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Angkatan
              </label>
              <select
                name='angkatan'
                value={formData.angkatan}
                onChange={handleInputChange}
                className='input-field'
                required
              >
                <option value=''>Pilih Angkatan</option>
                {Array.from({ length: 2020 - 1994 + 1 }, (_, i) => {
                  const tahun = 1994 + i
                  return (
                    <option key={tahun} value={tahun}>
                      Angkatan {tahun}
                    </option>
                  )
                })}
              </select>
            </div> */}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Jumlah Iuran
              </label>
              <input
                type='number'
                name='jumlahIuran'
                value={jumlahIuran}
                onChange={handleInputChange}
                className='input-field'
                placeholder='Masukkan jumlah iuran'
                required
              />
            </div>

            <div className='md:col-span-2 flex space-x-3'>
              <button type='submit' className='btn-primary'>
                Simpan Data
              </button>
              <button
                type='button'
                onClick={() =>
                  setShowEditForm({
                    angkatan: 0
                  })
                }
                className='btn-secondary'
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Data */}
      <div className='card p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Data Iuran Saat Ini
        </h2>

        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Angkatan
                </th>
                <th className='text-right py-3 px-4 text-sm font-medium text-gray-500'>
                  Jumlah Iuran
                </th>
                <th className='text-center py-3 px-4 text-sm font-medium text-gray-500'>
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows */}
              {meta?.angkatanList.map((angkatan: Record<string, number>) => (
                <tr className='border-b border-gray-100'>
                  <td className='py-3 px-4 text-sm font-medium text-gray-900'>
                    {angkatan.tahunAngkatan}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                    {formatCurrency(angkatan.total)}
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <button
                      onClick={() =>
                        setShowEditForm({
                          angkatan: angkatan.tahunAngkatan
                        })
                      }
                      disabled={showEditForm.angkatan !== 0}
                      className='p-1 hover:bg-gray-100 rounded cursor-pointer'
                    >
                      <Edit className='h-4 w-4 text-gray-600' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className='card p-6 bg-yellow-50 border-yellow-200'>
        <h3 className='text-lg font-semibold text-yellow-900 mb-2'>
          Petunjuk Penggunaan
        </h3>
        <ul className='text-yellow-800 space-y-1 text-sm'>
          <li>• Klik ikon edit untuk mengubah data yang sudah ada</li>
          <li>
            • Pastikan semua data yang dimasukkan sudah benar sebelum disimpan
          </li>
          <li>• Data akan langsung terlihat di dashboard setelah disimpan</li>
        </ul>
      </div>
    </div>
  )
}

export default EditReportsPage
