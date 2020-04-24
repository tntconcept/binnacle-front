import React, {Suspense, useContext} from "react"
import {Redirect, Route, RouteProps, Switch} from "react-router-dom"
import {AuthContext} from "core/contexts/AuthContext"
import LoadingLayout from "core/components/LoadingLayout"
import {UserProvider} from "core/contexts/UserContext"

const PrivateRoute: React.FC<RouteProps> = ({
  component: ComponentWrapped,
  ...rest
}) => {
  const auth = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        /* prettier-ignore */
        // @ts-ignore
        // TODO FIX ERROR WHEN THE USER ENTERS
        auth.isAuthenticated ? (<UserProvider><ComponentWrapped {...props} /></UserProvider>
        ) : (
          <Redirect to="/login"/>
        )
      }
    />
  );
};

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
  import(
    /*
	webpackChunkName: "settings"
	*/ "pages/settings/SettingsPage"
  )
);

const Routes: React.FC = () => (
  <Suspense fallback={<LoadingLayout />}>
    <Switch>
      <Route path={["/", "/login"]} exact component={LazyLoginPage} />
      <PrivateRoute path="/binnacle" component={LazyBinnaclePage} />
      <PrivateRoute path="/settings" component={LazySettingsPage} />
    </Switch>
  </Suspense>
);

export default Routes;
