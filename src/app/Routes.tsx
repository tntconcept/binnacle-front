import React, { Suspense } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { FullPageLoadingSpinner } from 'core/components'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import VacationPage from 'pages/vacation/VacationPage'
import { AppProviders } from './AppProviders'
import { Button, useColorMode } from '@chakra-ui/core'

const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ 'pages/login/LoginPage')
)

const LazyBinnaclePage = React.lazy(() =>
  import(/*
	webpackChunkName: "binnacle",
	webpackPrefetch: true
	*/ 'pages/binnacle')
)

const LazySettingsPage = React.lazy(() =>
  import(/*
	webpackChunkName: "settings"
	*/ 'pages/settings/SettingsPage')
)

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<FullPageLoadingSpinner />}>
      <Switch>
        <Route path="/" exact component={LoginPageWithChakra} />
        <Suspense
          // Workaround to avoid showing the components placeholders when the page loads.
          // Look at CalendarDesktop to understand more...
          fallback={<FullPageLoadingSpinner />}
        >
          <Route path="/binnacle" component={BinnaclePageWithChakra} />
          <PrivateRoute path="/settings" component={SettingsPageWithChakra} />
          <PrivateRoute path="/vacations" component={VacationWithChakra} />
        </Suspense>
      </Switch>
    </Suspense>
  )
}

function Example() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Button>
    </header>
  )
}

function BinnaclePageWithChakra() {
  return (
    <AppProviders>
      <Example />
      <LazyBinnaclePage />
    </AppProviders>
  )
}

function LoginPageWithChakra() {
  return (
    <AppProviders>
      <LazyLoginPage />
    </AppProviders>
  )
}

function SettingsPageWithChakra() {
  return (
    <AppProviders>
      <LazySettingsPage />
    </AppProviders>
  )
}

function VacationWithChakra() {
  return (
    <AppProviders>
      <VacationPage />
    </AppProviders>
  )
}

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  return <Route {...props} />
}

export default Routes
