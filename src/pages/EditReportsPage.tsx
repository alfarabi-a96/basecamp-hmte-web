import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '../context/useAuth'
import { Plus, Edit, Save, X } from 'lucide-react'
// import { getAuth, updateProfile } from 'firebase/auth'

interface FormData {
  angkatan: string
  jumlahIuran: string
  tahun: string
  keterangan: string
}

const EditReportsPage: React.FC = () => {
  const { isAdmin } = useAuth()
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    angkatan: '',
    jumlahIuran: '',
    tahun: '2024',
    keterangan: ''
  })

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className='card p-6 text-center'>
        <h1 className='text-xl font-semibold text-gray-900 mb-2'>
          Akses Ditolak
        </h1>
        <p className='text-gray-600'>
          Halaman ini hanya dapat diakses oleh administrator.
        </p>
      </div>
    )
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // Handle form submission logic here
    setShowAddForm(false)
    setFormData({
      angkatan: '',
      jumlahIuran: '',
      tahun: '2024',
      keterangan: ''
    })
  }

  const handleEdit = async (id: string): Promise<any> => {
    setEditingItem(id)
    // const auth = getAuth()
    // const user = auth.currentUser

    // if (user) {
    //   await updateProfile(user, { displayName: 'Alfa' })
    //   console.log('Display Name berhasil ditambahkan:', user.displayName)
    // }
  }

  return (
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
          <button
            onClick={() => setShowAddForm(true)}
            className='btn-primary flex items-center space-x-2'
          >
            <Plus className='h-4 w-4' />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className='card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Tambah Data Iuran
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className='p-2 hover:bg-gray-100 rounded-lg'
            >
              <X className='h-4 w-4' />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            <div>
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
                <option value='2020'>Angkatan 2020</option>
                <option value='2019'>Angkatan 2019</option>
                <option value='2018'>Angkatan 2018</option>
                <option value='2017'>Angkatan 2017</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Jumlah Iuran
              </label>
              <input
                type='number'
                name='jumlahIuran'
                value={formData.jumlahIuran}
                onChange={handleInputChange}
                className='input-field'
                placeholder='Masukkan jumlah iuran'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tahun
              </label>
              <input
                type='number'
                name='tahun'
                value={formData.tahun}
                onChange={handleInputChange}
                className='input-field'
                placeholder='2024'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Keterangan
              </label>
              <input
                type='text'
                name='keterangan'
                value={formData.keterangan}
                onChange={handleInputChange}
                className='input-field'
                placeholder='Keterangan tambahan'
              />
            </div>

            <div className='md:col-span-2 flex space-x-3'>
              <button type='submit' className='btn-primary'>
                Simpan Data
              </button>
              <button
                type='button'
                onClick={() => setShowAddForm(false)}
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
                <th className='text-right py-3 px-4 text-sm font-medium text-gray-500'>
                  Kontributor
                </th>
                <th className='text-right py-3 px-4 text-sm font-medium text-gray-500'>
                  Tahun
                </th>
                <th className='text-center py-3 px-4 text-sm font-medium text-gray-500'>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows */}
              <tr className='border-b border-gray-100'>
                <td className='py-3 px-4 text-sm font-medium text-gray-900'>
                  Angkatan 2020
                </td>
                <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                  Rp 8.500.000
                </td>
                <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                  17/25
                </td>
                <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                  2024
                </td>
                <td className='py-3 px-4 text-center'>
                  <button
                    onClick={() => handleEdit('1')}
                    className='p-1 hover:bg-gray-100 rounded'
                  >
                    <Edit className='h-4 w-4 text-gray-600' />
                  </button>
                </td>
              </tr>

              <tr className='border-b border-gray-100'>
                <td className='py-3 px-4 text-sm font-medium text-gray-900'>
                  Angkatan 2019
                </td>
                <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                  Rp 9.200.000
                </td>
                <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                  23/30
                </td>
                <td className='py-3 px-4 text-sm text-gray-900 text-right'>
                  2024
                </td>
                <td className='py-3 px-4 text-center'>
                  <button
                    onClick={() => handleEdit('2')}
                    className='p-1 hover:bg-gray-100 rounded'
                  >
                    <Edit className='h-4 w-4 text-gray-600' />
                  </button>
                </td>
              </tr>
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
          <li>• Klik tombol "Tambah Data" untuk menambah iuran baru</li>
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
