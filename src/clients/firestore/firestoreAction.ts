// src/services/reportService.js
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import { db } from '../firestore/firestoreClient'

// ambil meta iuran tahun tertentu (2025)
export const getYearMeta = async (year = '2025') => {
  // meta disimpan dalam subcollection "meta" -> document "0"
  const snap = await getDoc(doc(db, 'iuran', year))
  return snap.exists() ? snap.data() : null
}

// ambil summary rekapTahunan
export const getSummary = async () => {
  const snap = await getDoc(doc(db, 'iuran', 'rekapTahunan'))
  return snap.exists() ? snap.data() : null
}

// tambah data per angkatan
export const addAngkatanToList = async (
  year = '2025',
  angkatanTahun: string,
  total: string
) => {
  const docRef = doc(db, 'iuran', year)

  await updateDoc(docRef, {
    angkatanList: arrayUnion({
      tahunAngkatan: Number(angkatanTahun),
      total: Number(total)
    })
  })
}

// update data per angkatan
export const updateAngkatanAndIuranTotal = async (
  year = '2025',
  angkatanTahun: number,
  newTotal: number
) => {
  const iuranRef = doc(db, 'iuran', year)
  const rekapRef = doc(db, 'iuran', 'rekapTahunan')

  // 1️⃣ Ambil data dari iuran/{year}
  const snap = await getDoc(iuranRef)
  if (!snap.exists()) throw new Error('Dokumen tidak ditemukan')

  const data = snap.data()
  const angkatanList = data.angkatanList || []
  const iuranData = data.iuranData || { target: 0, total: 0 }

  // 2️⃣ Update item angkatan yang cocok
  const updatedList = angkatanList.map((item: Record<string, number>) =>
    item.tahunAngkatan === angkatanTahun ? { ...item, total: newTotal } : item
  )

  // Kalau belum ada angkatan tsb, tambahkan baru
  const found = updatedList.find(
    (data: Record<string, number>) => data.tahunAngkatan === angkatanTahun
  )
  if (!found)
    updatedList.push({ tahunAngkatan: angkatanTahun, total: newTotal })

  // 3️⃣ Hitung ulang total keseluruhan
  const updatedTotal = updatedList.reduce(
    (sum: number, item: Record<string, number>) => sum + item.total,
    0
  )

  const rekapSnap = await getDoc(rekapRef)
  let rekapData = rekapSnap.exists()
    ? rekapSnap.data()
    : { target: 0, total: 0 }

  // 4️⃣ Simpan perubahan ke iuran/{year}
  await setDoc(
    iuranRef,
    {
      angkatanList: updatedList,
      iuranData: {
        ...iuranData,
        total: updatedTotal
      },
      lastUpdated: serverTimestamp()
    },
    { merge: true }
  )

  // 5️⃣ Update juga ke iuran/rekapTahunan.{year}
  await setDoc(
    rekapRef,
    {
      [year]: {
        angkatanList: updatedList,
        total: rekapData[year]?.sisaTahunLalu + updatedTotal,
        target: rekapData[year]?.target ?? 0,
        lastUpdated: serverTimestamp(),
        sisaTahunLalu: rekapData[year]?.sisaTahunLalu ?? 0
      }
    },
    { merge: true }
  )
}
