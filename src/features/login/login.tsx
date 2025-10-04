import { useState } from 'react'
import { LOGIN_COPY } from './loginStatics'
import { GoogleIcon } from '../../icons/Google'
import { useAuth } from '../../lib/authContext'
import { Button, Card, Alert } from 'antd'

export function Login() {
  const { signInWithGoogle, loading: authLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
      // The verification and redirect will be handled by the auth context
      // after successful token verification
    } catch (err) {
      console.error('Google sign-in failed', err)
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {LOGIN_COPY.title}
            </h1>
            <p className="text-gray-600">
              {LOGIN_COPY.subtitle}
            </p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          <Button
            type="default"
            onClick={handleGoogleSignIn}
            loading={authLoading}
            className="w-full h-12 flex items-center justify-center"
            icon={!authLoading && <GoogleIcon className="h-5 w-5" />}
          >
            {authLoading ? 'Signing in...' : LOGIN_COPY.googleCta}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Login


