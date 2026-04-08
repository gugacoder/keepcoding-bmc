import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSoloProfile } from '@/contexts/ProfileContext'

export function RouteGuard({ children }: { children?: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const { isConfigured } = useSoloProfile()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // First-run detection: redirect unconfigured users to onboarding
  if (!isConfigured && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // Already configured: redirect away from onboarding
  if (isConfigured && location.pathname === '/onboarding') {
    return <Navigate to="/monitor" replace />
  }

  return <>{children ?? <Outlet />}</>
}
