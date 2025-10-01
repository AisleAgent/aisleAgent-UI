import { LOGIN_COPY } from './loginStatics'
import { signInWithGoogle } from '../../lib/auth'
import { GoogleIcon } from '../../icons/Google'

export function Login() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google sign-in failed', err)
      alert('Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-900">{LOGIN_COPY.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{LOGIN_COPY.subtitle}</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <GoogleIcon className="h-5 w-5" />
          {LOGIN_COPY.googleCta}
        </button>
      </div>
    </div>
  )
}

export default Login


