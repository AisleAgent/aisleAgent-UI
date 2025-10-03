import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { getFirebaseApp } from './firebase'
import { useFirebaseUser, useStoredUser, useGoogleSignIn, useSignOut, type AuthUser } from './authQueries'

type AuthContextValue = {
  userData: AuthUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // React Query hooks
  const { isLoading: firebaseLoading } = useFirebaseUser()
  const { data: userData, isLoading: userLoading } = useStoredUser()
  const googleSignInMutation = useGoogleSignIn()
  const signOutMutation = useSignOut()

  // Sync Firebase auth state with React Query
  useEffect(() => {
    const auth = getAuth(getFirebaseApp())
    const unsubscribe = onAuthStateChanged(auth, () => {
      // This will trigger the useFirebaseUser query to refetch
      // React Query will handle the state updates
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