import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isCheckingAuth } = useAuth()
  const location = useLocation()

  if (isCheckingAuth) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace state={{ from: location.pathname }} />
  }

  return children
}

export default AuthGuard
