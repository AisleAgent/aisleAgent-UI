import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { DASHBOARD_COPY } from '../features/dashboard/dashboardStatics'
import { ROUTES } from '../routes/routeStatics'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const { userData, signOutUser } = useAuth()
  const navigate = useNavigate()

  const displayName = userData?.name || 'User'
  const photoURL = userData?.picture || undefined

  return (
    <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="text-lg font-semibold text-foreground">{DASHBOARD_COPY.navbarTitle}</div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-muted-foreground">{displayName}</span>
          <Avatar className="h-9 w-9">
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            type="button"
            onClick={() => {
              signOutUser()
              navigate(ROUTES.LOGIN)
            }}
            variant="outline"
            size="sm"
          >
            {DASHBOARD_COPY.logout}
          </Button>
        </div>
      </div>
    </nav>
  )
}
