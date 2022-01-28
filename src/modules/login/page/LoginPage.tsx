import { observer } from 'mobx-react'
import { LoginForm } from 'modules/login/components/LoginForm/LoginForm'
import type { FC } from 'react'
import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { PageTitle } from 'shared/components/PageTitle'
import { AppState } from 'shared/data-access/state/app-state'
import { paths } from 'shared/router/paths'
import { AutoLoginAction } from 'modules/login/data-access/actions/auto-login-action'
import FullPageLoadingSpinner from 'shared/components/FullPageLoadingSpinner'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'

const useAutoLogin = () => {
  const [autoLogging, loading] = useActionLoadable(AutoLoginAction, {
    initialLoading: true,
    showAlertError: false
  })

  useEffect(() => {
    autoLogging(undefined)
  }, [autoLogging])

  return loading
}

const LoginPage: FC = () => {
  const autoLogging = useAutoLogin()
  const { isAuthenticated } = useGlobalState(AppState)
  const navigate = useNavigate()
  const location = useLocation()

  let from = location.state?.from?.pathname || paths.binnacle

  useLayoutEffect(() => {
    if (isAuthenticated && !autoLogging) {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page.
      // Use { replace: true } so we don't create another entry in the history stack for the login page.
      navigate(from, { replace: true })
    }
  }, [from, isAuthenticated, autoLogging, navigate])

  return (
    <PageTitle title='Login'>
      {autoLogging ? <FullPageLoadingSpinner /> : <LoginForm />}
    </PageTitle>
  )
}

export default observer(LoginPage)
