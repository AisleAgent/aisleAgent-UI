import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirebaseApp } from './firebase'
// import { apiClient } from './axios'
// import { mockVerifyGoogleToken, shouldUseMock } from '../services/mockAuth'

export interface VerifyResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: {
    id: number
    email: string
    fullName: string
    userType: string
    profilePictureUrl?: string
    isActive: boolean
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string
  picture?: string
  emailVerified: boolean
  userType?: string
  isActive?: boolean
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  firebase: () => [...authKeys.all, 'firebase'] as const,
}

// Get current Firebase user
export function useFirebaseUser() {
  return useQuery({
    queryKey: authKeys.firebase(),
    queryFn: () => {
      const auth = getAuth(getFirebaseApp())
      return auth.currentUser
    },
    staleTime: 0, // Always fresh to reflect auth state changes
    refetchOnWindowFocus: true,
  })
}

// Get stored user data
export function useStoredUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => {
      const storedUser = localStorage.getItem('user_details')
      return storedUser ? JSON.parse(storedUser) as AuthUser : null
    },
    staleTime: 0, // Always fresh to reflect auth state changes
    refetchOnWindowFocus: true,
  })
}

// Verify Google token mutation - COMMENTED OUT (not used anymore)
// export function useVerifyGoogleToken() {
//   const queryClient = useQueryClient()
//   
//   return useMutation({
//     mutationFn: async (idToken: string): Promise<VerifyResponse> => {
//       if (shouldUseMock()) {
//         console.log('🔧 Using mock authentication service for development')
//         return await mockVerifyGoogleToken(idToken)
//       } else {
//         console.log('🚀 Using real authentication service for production')
//         const response = await apiClient.post<VerifyResponse>('/api/v1/auth/google/verify', { idToken })
//         return response.data
//       }
//     },
//     onSuccess: (data) => {
//       const { accessToken, user: backendUser } = data
//       
//       const normalizedUser: AuthUser = {
//         id: backendUser.id.toString(),
//         email: backendUser.email,
//         name: backendUser.fullName,
//         picture: backendUser.profilePictureUrl,
//         emailVerified: true, // Backend verified
//         userType: backendUser.userType,
//         isActive: backendUser.isActive,
//       }

//       // Store user data and token
//       localStorage.setItem('auth_token', accessToken)
//       localStorage.setItem('user_details', JSON.stringify(normalizedUser))
//       
//       // Update the stored user query
//       queryClient.setQueryData(authKeys.user(), normalizedUser)
//     },
//     onError: (error) => {
//       console.error('❌ Token verification failed:', error)
//       localStorage.removeItem('auth_token')
//       localStorage.removeItem('user_details')
//       queryClient.setQueryData(authKeys.user(), null)
//     }
//   })
// }

// Google sign-in mutation
export function useGoogleSignIn() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const auth = getAuth(getFirebaseApp())
      const provider = new GoogleAuthProvider()
      
      // Request basic user info scopes
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')

      const result = await signInWithPopup(auth, provider)
      
      return { result }
    },
    onSuccess: async ({ result }) => {
      // Use Firebase user data directly
      const user = result.user
      const normalizedUser: AuthUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        picture: user.photoURL || undefined,
        emailVerified: user.emailVerified,
        userType: 'STANDARD', // Default user type
        isActive: true, // Default active status
      }

      // Store user data directly from Firebase
      localStorage.setItem('user_details', JSON.stringify(normalizedUser))
      
      // Update React Query cache to trigger re-render
      queryClient.setQueryData(authKeys.user(), normalizedUser)
      
      console.log('✅ Google sign-in successful (Firebase only)')
    },
    onError: (error) => {
      console.error('❌ Google sign-in failed:', error)
    }
  })
}

// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const auth = getAuth(getFirebaseApp())
      await signOut(auth)
    },
    onSuccess: () => {
      // Clear all stored data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_details')
      
      // Invalidate and clear all auth-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      queryClient.setQueryData(authKeys.user(), null)
      queryClient.setQueryData(authKeys.firebase(), null)
      
      console.log('User signed out successfully.')
    },
    onError: (error) => {
      console.error('❌ Sign-out error:', error)
    }
  })
}
