import { getFirebaseApp } from './firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

export async function signInWithGoogle(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  await signInWithPopup(auth, provider)
}

export async function signOutUser(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  await signOut(auth)
}


