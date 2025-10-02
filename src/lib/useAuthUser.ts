import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { getFirebaseApp } from './firebase'

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
    const auth = getAuth(getFirebaseApp())
    const unsub = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          picture: firebaseUser.photoURL || undefined,
          emailVerified: firebaseUser.emailVerified,
        }
        setUser(authUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { user, loading }
}
