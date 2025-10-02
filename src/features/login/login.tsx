import { useState } from 'react'
import { LOGIN_COPY } from './loginStatics'
import { signInWithGoogle } from '../../lib/auth'
import { GoogleIcon } from '../../icons/Google'

export function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
      console.log('✅ Sign-in successful, should redirect to dashboard...')
    } catch (err) {
      console.error('Google sign-in failed', err)
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-900">{LOGIN_COPY.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{LOGIN_COPY.subtitle}</p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <GoogleIcon className="h-5 w-5" />
          )}
          {loading ? 'Signing in...' : LOGIN_COPY.googleCta}
        </button>
      </div>
    </div>
  )
}

export default Login


