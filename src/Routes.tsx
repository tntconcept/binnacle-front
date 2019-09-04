import React, { Suspense, useContext } from "react";
import { Switch, Route, RouteProps, Redirect } from "react-router-dom";
import { AuthContext } from "core/contexts/AuthContext";
import { LoadingLayout } from "utils/HOCs/withSuspensePage";

const PrivateRoute: React.FC<RouteProps> = ({
  component: ComponentWrapped,
  ...rest
}) => {
  const auth = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated ? (
          // @ts-ignore
          <ComponentWrapped {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const LoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ "pages/login/LoginPage")
);

const BinnaclePage = React.lazy(() =>
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
      <Route
        path={["/", "/login"]}
        exact
        component={LoginPage} />
      <PrivateRoute
        path="/binnacle"
        component={BinnaclePage} />
    </Switch>
  </Suspense>
);

export default Routes;
