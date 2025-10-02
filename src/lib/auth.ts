import { getFirebaseApp } from './firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { apiClient } from './axios'

interface BackendAuthResponse {
  user: {
    id: string
    email: string
    name: string
    picture?: string
    emailVerified: boolean
  }
  token: string
  refreshToken?: string
}

export async function signInWithGoogle(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  
  // Request Calendar scope for accessing Google Calendar
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly')
  
  const result = await signInWithPopup(auth, provider)
  
  // Get Firebase ID token
  const idToken = await result.user.getIdToken()
  
  // Store Google access token for Calendar API calls
  const credential = GoogleAuthProvider.credentialFromResult(result)
  if (credential?.accessToken) {
    localStorage.setItem('google_access_token', credential.accessToken)
  }
  
  // Call backend to verify token and get user details
  try {
    const response = await apiClient.post<BackendAuthResponse>('/api/v1/auth/google/verify', {
      idToken
    })
    
    const { user, token, refreshToken } = response.data
    
    // Store user details and tokens
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_details', JSON.stringify(user))
    
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }
    
    console.log('User authenticated successfully:', user)
  } catch (error) {
    console.error('Backend authentication failed:', error)
    // Clean up on failure
    localStorage.removeItem('google_access_token')
    await signOut(auth)
    throw new Error('Authentication with backend failed')
  }
}

export async function signOutUser(): Promise<void> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  
  // Clear all stored auth data
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_details')
  localStorage.removeItem('google_access_token')
  
  await signOut(auth)
}

// Helper function to get stored user details
export function getCurrentUser() {
  const userDetails = localStorage.getItem('user_details')
  return userDetails ? JSON.parse(userDetails) : null
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}


