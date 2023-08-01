import type { FC, PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/auth-context'
import { paths } from './paths'

export const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuthContext()
  const location = useLocation()

  if (isLoggedIn === undefined) return null
  if (!isLoggedIn) {
    return <Navigate to={paths.login} state={{ from: location }} />
  }

  return children as any
}
