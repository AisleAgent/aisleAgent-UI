import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, type Analytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'

let app: FirebaseApp | undefined
let analytics: Analytics | undefined

const firebaseConfig = {
  apiKey: 'AIzaSyDky8NaU6-Y_GDzCffBNTyNY9vSe3OWjxo',
  authDomain: 'aisle-agents.firebaseapp.com',
  projectId: 'aisle-agents',
  storageBucket: 'aisle-agents.firebasestorage.app',
  messagingSenderId: '728540386941',
  appId: '1:728540386941:web:d77c500b76c1c992c94314',
  measurementId: 'G-WB0DETYRTT',
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

export async function getFirebaseAnalytics(): Promise<Analytics | undefined> {
  if (analytics) return analytics
  if (typeof window === 'undefined') return undefined
  const supported = await isAnalyticsSupported()
  if (!supported) return undefined
  analytics = getAnalytics(getFirebaseApp())
  return analytics
}


