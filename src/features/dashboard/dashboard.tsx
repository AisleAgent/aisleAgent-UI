import { useAuth } from '../../lib/authContext'
import { Navbar } from '../../components/Navbar'
import { DASHBOARD_COPY } from './dashboardStatics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const { userData } = useAuth()

  const displayName = userData?.name || 'User'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{DASHBOARD_COPY.welcomePrefix} {displayName}</h1>
            <p className="mt-2 text-muted-foreground">{DASHBOARD_COPY.signedInNote}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                You are successfully authenticated and can access all features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {userData?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>User Type:</strong> {userData?.userType || 'Standard'}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Status:</strong> {userData?.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


