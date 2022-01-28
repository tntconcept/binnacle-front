import { observer } from 'mobx-react'
import type { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { AppState } from 'shared/data-access/state/app-state'

export const RequireAuth: FC = observer(({ children }) => {
  const { isAuthenticated } = useGlobalState(AppState)
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children as any
})
