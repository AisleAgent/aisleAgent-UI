import { getFirebaseApp } from './firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

export async function signInWithGoogle(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  
  // Request calendar permissions
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly')
  provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly')
  
  try {
    const result = await signInWithPopup(auth, provider)
    
    // Store Google access token for Calendar API
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (credential?.accessToken) {
      localStorage.setItem('google_access_token', credential.accessToken)
      console.log('✅ Google access token stored for Calendar API')
    } else {
      console.warn('⚠️ No access token received from Google')
    }
  } catch (error: any) {
    console.error('❌ Google sign-in failed:', error)
    throw error
  }
}

export async function signOutUser(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  
  // Clear stored Google access token
  localStorage.removeItem('google_access_token')
  
  await signOut(auth)
}


