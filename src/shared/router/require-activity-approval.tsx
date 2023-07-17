import type { FC, PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/auth-context'
import { paths, rawPaths } from './paths'

export const RequireActivityApproval: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn, canApproval } = useAuthContext()
  const location = useLocation()

  if (isLoggedIn === undefined) return null
  if (!isLoggedIn) {
    return <Navigate to={rawPaths.login} state={{ from: location }} />
  }
  if (!canApproval) {
    return <Navigate to={paths.binnacle} state={{ from: location }} />
  }

  return children as any
}
