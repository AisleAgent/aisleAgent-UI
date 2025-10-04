import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { getFirebaseApp } from './firebase'
import { useFirebaseUser, useStoredUser, useGoogleSignIn, useSignOut, type AuthUser } from './authQueries'
import { ROUTES } from '../routes/routeStatics'

type AuthContextValue = {
  userData: AuthUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  
  // React Query hooks
  const { isLoading: firebaseLoading } = useFirebaseUser()
  const { data: userData, isLoading: userLoading } = useStoredUser()
  const googleSignInMutation = useGoogleSignIn()
  const signOutMutation = useSignOut()

  // Handle navigation after successful authentication
  useEffect(() => {
    if (userData && !userLoading) {
      // User is authenticated, redirect to onboarding
      console.log('✅ User authenticated, redirecting to onboarding...')
      navigate(ROUTES.ONBOARDING)
    }
  }, [userData, userLoading, navigate])

  // Sync Firebase auth state with React Query
  useEffect(() => {
    const auth = getAuth(getFirebaseApp())
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Force refetch of Firebase user query when auth state changes
      if (!user) {
        // User signed out - clear all auth data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_details')
      }
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await googleSignInMutation.mutateAsync()
  }

  const signOutUser = async () => {
    await signOutMutation.mutateAsync()
  }

  const isAuthenticated = () => {
    return userData !== null
  }

  const loading = firebaseLoading || userLoading || googleSignInMutation.isPending || signOutMutation.isPending

  const value: AuthContextValue = {
    userData: userData ?? null,
    loading,
    signInWithGoogle,
    signOutUser,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}