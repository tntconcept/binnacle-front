import React, { Suspense } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { useAuthentication } from 'core/providers/AuthenticationProvider'
import FullPageLoadingSpinner from 'core/components/FullPageLoadingSpinner'

const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ 'pages/login/LoginPage')
)

const LazyBinnaclePage = React.lazy(() =>
  import(/*
	webpackChunkName: "binnacle",
	webpackPrefetch: true
	*/ 'pages/binnacle/BinnaclePage')
)

const LazyVacationsPage = React.lazy(() =>
  import(/*
	webpackChunkName: "vacations"
	*/ 'pages/vacation/VacationPage')
)

const LazySettingsPage = React.lazy(() =>
  import(/*
	webpackChunkName: "settings"
	*/ 'pages/settings/SettingsPage')
)

export const AppRoutes: React.FC = () => {
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
          <PrivateRoute path="/vacations" component={LazyVacationsPage} />
        </Suspense>
      </Switch>
    </Suspense>
  )
}

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) {
    return <Redirect to="/" />
  }

  return <Route {...props} />
}
