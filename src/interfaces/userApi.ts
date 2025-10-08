import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../clients/firestore/firestoreClient'

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential.user
  } catch (error) {
    console.error('Gagal login:', error)
    throw error
  }
}

// Logout user
export const logoutUser = async () => {
  await signOut(auth)
}
