import React, { Suspense } from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import { LoadingLayout } from 'common/components'
import { useAuthentication } from 'features/Authentication'

const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ 'pages/login')
)

const LazyBinnaclePage = React.lazy(() =>
  import(
    /*
	webpackChunkName: "binnacle",
	webpackPrefetch: true
	*/ 'pages/binnacle/BinnaclePage'
  )
)

const LazySettingsPage = React.lazy(() =>
  import(/*
	webpackChunkName: "settings"
	*/ 'pages/settings')
)

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingLayout />}>
      <Switch>
        <Route
          path="/"
          exact
          component={LazyLoginPage} />
        <Suspense
          // Workaround to avoid showing the components placeholders when the page loads.
          // Look at CalendarDesktop to understand more...
          fallback={<LoadingLayout />}
        >
          <PrivateRoute
            path="/binnacle"
            component={LazyBinnaclePage} />
          <PrivateRoute
            path="/settings"
            component={LazySettingsPage} />
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

export default Routes
