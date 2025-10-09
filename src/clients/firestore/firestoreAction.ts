// src/services/reportService.js
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firestore/firestoreClient'

// ambil meta iuran tahun tertentu (2025)
export async function getYearMeta(year = '2025') {
  // meta disimpan dalam subcollection "meta" -> document "0"
  const snap = await getDoc(doc(db, 'iuran', year))
  return snap.exists() ? snap.data() : null
}

// ambil summary rekapTahunan (kalau kamu punya document "rekapTahunan")
export async function getSummary() {
  const snap = await getDoc(doc(db, 'iuran', 'rekapTahunan'))
  return snap.exists() ? snap.data() : null
}

// update data angkatan tertentu (document "0" di angkatanList)
// export async function updateAngkatan(year = '2025', docId = '0', data) {
//   const ref = doc(db, 'iuran', year, 'angkatanList', docId)
//   await updateDoc(ref, data)
// }

// update meta (document "0" di subcollection "meta")
// export async function updateMeta(year = '2025', data) {
//   const ref = doc(db, 'iuran', year, 'meta', '0')
//   await updateDoc(ref, data)
// }
