import type { FC, PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/auth-context'
import { paths } from './paths'

export const RequireBlockRole: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn, canBlock } = useAuthContext()
  const location = useLocation()

  if (isLoggedIn === undefined) return null
  if (!isLoggedIn) {
    return <Navigate to={paths.login} state={{ from: location }} />
  }
  if (!canBlock) {
    return <Navigate to={paths.binnacle} state={{ from: location }} />
  }

  return children as any
}
