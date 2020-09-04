import React, { Suspense } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { FullPageLoadingSpinner } from 'core/components'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import { VacationPage } from 'pages/vacation/VacationPage'
import { AppProviders } from './AppProviders'

const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ 'pages/login')
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
	*/ 'pages/settings')
)

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<FullPageLoadingSpinner />}>
      <Switch>
        <Route path="/" exact component={LazyLoginPage} />
        <Suspense
          // Workaround to avoid showing the components placeholders when the page loads.
          // Look at CalendarDesktop to understand more...
          fallback={<FullPageLoadingSpinner />}
        >
          <PrivateRoute path="/binnacle" component={LazyBinnaclePage} />
          <PrivateRoute path="/settings" component={LazySettingsPage} />
          <PrivateRoute path="/vacations" component={VacationWithChakra} />
        </Suspense>
      </Switch>
    </Suspense>
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
