import type { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from 'shared/contexts/auth-context'
import { rawPaths } from './paths'

export const RequireAuth: FC = ({ children }) => {
  const { isLoggedIn } = useAuthContext()
  const location = useLocation()

  if (isLoggedIn === undefined) return null
  if (isLoggedIn === false) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login.
    return <Navigate to={rawPaths.login} state={{ from: location }} />
  }

  return children as any
}
