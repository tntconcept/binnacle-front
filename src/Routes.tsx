import React, {Suspense, useContext} from "react"
import {Redirect, Route, RouteProps, Switch} from "react-router-dom"
import {AuthContext} from "core/contexts/AuthContext"
import LoadingLayout from "utils/LoadingLayout/LoadingLayout"
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
        auth.isAuthenticated ? (<UserProvider><ComponentWrapped {...props} /></UserProvider>
        ) : (
          <Redirect to="/login"/>
        )
      }
    />
  );
};

const AsyncLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ "pages/login/LoginPage")
);

const AsyncBinnaclePage = React.lazy(() =>
  import(
    /*
	webpackChunkName: "binnacle-v2",
	webpackPrefetch: true
	*/ "pages/binnacle/BinnaclePage"
  )
);

const Routes: React.FC = () => (
  <Suspense fallback={<LoadingLayout />}>
    <Switch>
      <Route path={["/", "/login"]} exact component={AsyncLoginPage} />
      <Route path="/binnacle" component={AsyncBinnaclePage} />
    </Switch>
  </Suspense>
);

export default Routes;
