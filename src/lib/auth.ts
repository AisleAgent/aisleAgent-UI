import { getFirebaseApp } from './firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

export async function signInWithGoogle(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  
  // Request Calendar scope for accessing Google Calendar
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly')
  
  const result = await signInWithPopup(auth, provider)
  
  // Store the access token for Calendar API calls
  const credential = GoogleAuthProvider.credentialFromResult(result)
  if (credential?.accessToken) {
    localStorage.setItem('google_access_token', credential.accessToken)
  }
}

export async function signOutUser(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  
  // Clear stored Google access token
  localStorage.removeItem('google_access_token')
  
  await signOut(auth)
}


