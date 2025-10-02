import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirebaseApp } from './firebase'
import { getCurrentUser, isAuthenticated } from './auth'

interface AuthUser {
  id: string
  email: string
  name: string
  picture?: string
  emailVerified: boolean
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated with backend
    if (isAuthenticated()) {
      const userDetails = getCurrentUser()
      setUser(userDetails)
      setLoading(false)
    } else {
      // Listen to Firebase auth changes for initial sign-in
      const auth = getAuth(getFirebaseApp())
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser && isAuthenticated()) {
          // User is signed in with Firebase and has backend auth
          const userDetails = getCurrentUser()
          setUser(userDetails)
        } else {
          // User is not authenticated
          setUser(null)
        }
        setLoading(false)
      })
      return () => unsub()
    }
  }, [])

  return { user, loading }
}
