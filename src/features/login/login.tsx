import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN_COPY } from './loginStatics'
import { GoogleIcon } from '../../icons/Google'
import { useAuth } from '../../lib/authContext'
import { ROUTES } from '../../routes/routeStatics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function Login() {
  const { signInWithGoogle, loading: authLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
      console.log('✅ Sign-in successful, redirecting to dashboard...')
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      console.error('Google sign-in failed', err)
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{LOGIN_COPY.title}</CardTitle>
          <CardDescription>{LOGIN_COPY.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="w-full"
            variant="outline"
          >
            {authLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            {authLoading ? 'Signing in...' : LOGIN_COPY.googleCta}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login


