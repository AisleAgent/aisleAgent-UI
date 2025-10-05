import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/authContext'
import { Button, Alert } from 'antd'
import { ROUTES } from '../../routes/routeStatics'

export function Login() {
  const { signInWithGoogle, loading: authLoading, userData, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Handle redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated() && userData) {
      console.log('✅ User authenticated, redirecting to onboarding...')
      navigate(ROUTES.ONBOARDING)
    }
  }, [isAuthenticated, userData, navigate])

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

  const handleSignUp = async () => {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 
              className="text-4xl font-bold text-blue-600 drop-shadow-sm" 
              style={{ 
                fontFamily: 'Dancing Script, cursive',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              Servaya
            </h1>
          </div>
        </header>

      {/* Error Alert */}
      {error && (
        <div className="px-6 py-2">
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Graphic */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20"></div>
                <div className="absolute inset-4 bg-blue-500 rounded-full opacity-40"></div>
                <div className="absolute inset-8 bg-blue-400 rounded-full opacity-60"></div>
                <div className="absolute inset-12 bg-blue-300 rounded-full opacity-80"></div>
                <div className="absolute inset-16 bg-blue-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Ready to Run Your Business<br />
                Not Let It Run You?
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Close more leads, dazzle every couple, and run your business effortlessly. 
                Lead management, AI chatbot, custom websites, expense tracking, tasks, and calendar sync. 
                All in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="large"
                  onClick={handleSignUp}
                  loading={authLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto"
                >
                  {authLoading ? 'Signing in...' : 'Sign Up Free'}
                </Button>
                <Button 
                  size="large"
                  onClick={handleGoogleSignIn}
                  loading={authLoading}
                  className="border-blue-600 text-blue-600 hover:border-blue-700 px-8 py-3 h-auto"
                >
                  {authLoading ? 'Signing in...' : 'Log In'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Aisle.AI uses artificial intelligence to streamline every aspect of your wedding business, 
              so you can focus on what you do best: creating unforgettable experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Lead Management</h3>
              <p className="text-gray-600">
                Our AI qualifies, scores, and nurtures leads, so you can focus on the most promising prospects.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Collaboration Redefined</h3>
              <p className="text-gray-600">
                A shared portal lets clients track progress, sign contracts, and make payments, keeping everyone in sync.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automated Meeting Orchestration</h3>
              <p className="text-gray-600">
                Sync your calendar and let our AI schedule meetings, send reminders, and handle follow-ups automatically.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intelligent Pricing Engine</h3>
              <p className="text-gray-600">
                Our AI analyzes market data to help you create competitive and profitable pricing packages.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Expense Tracking</h3>
              <p className="text-gray-600">
                Effortlessly manage your business finances with AI-powered expense categorization and reporting.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Performance Coach</h3>
              <p className="text-gray-600">
                Get personalized insights and recommendations to optimize your business performance and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by the Best in the Business</h2>
          <p className="text-lg text-gray-600 mb-12">
            Hear what wedding professionals are saying about Aisle.AI
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
            <blockquote className="text-xl text-gray-700 italic mb-6">
              "Aisle cut my admin time in half and boosted my closure rate by 40%. 
              It's like hiring a business manager."
            </blockquote>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Naman Agrawal </p>
              <p className="text-gray-600">Wedding Photographer</p>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">© 2024 Aisle.AI All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Login


