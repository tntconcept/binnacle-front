import type { FC } from 'react'
import { useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageTitle } from 'shared/components/page-title'
import { paths } from 'shared/router/paths'
import { FullPageLoadingSpinner } from 'shared/components/full-page-loading-spinner'
import { LoginForm } from './components/login-form/login-form'
import { useAuthContext } from 'shared/contexts/auth-context'

const LoginPage: FC = () => {
  const { isLoggedIn } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { from: Location }
  const from = locationState?.from?.pathname || paths.binnacle

  useLayoutEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true })
    }
  }, [from, isLoggedIn, navigate])

  return (
    <PageTitle title="Login">
      {isLoggedIn === undefined ? <FullPageLoadingSpinner /> : <LoginForm />}
    </PageTitle>
  )
}

export default LoginPage
