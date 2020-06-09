import React, {Suspense} from "react"
import {Route, Switch} from "react-router-dom"
import LoadingLayout from "core/components/LoadingLayout"
import {PrivateRoute} from "app/PrivateRoute"

const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ "pages/login/LoginPage")
);

const LazyBinnaclePage = React.lazy(() =>
  import(
    /*
	webpackChunkName: "binnacle",
	webpackPrefetch: true
	*/ "pages/binnacle/BinnaclePage"
  )
);

const LazySettingsPage = React.lazy(() =>
  import(/*
	webpackChunkName: "settings"
	*/ "pages/settings/SettingsPage")
);

const Routes: React.FC = () => (
  <Suspense fallback={<LoadingLayout />}>
    <Switch>
      <Route path="/" exact component={LazyLoginPage} />
      <PrivateRoute path="/binnacle" component={LazyBinnaclePage} />
      <PrivateRoute path="/settings" component={LazySettingsPage} />
    </Switch>
  </Suspense>
);

export default Routes;
