import React, { useContext } from "react";
import { Switch, Route, RouteProps, Redirect } from "react-router-dom";
import { AuthContext } from "core/contexts/AuthContext";
import BinnaclePage from "pages/binnacle/BinnaclePage";
import LoginPage from "pages/login/LoginPage";

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

const Routes: React.FC = () => (
  <Switch>
    <Route
      path={["/", "/login"]}
      exact
      component={LoginPage} />
    <PrivateRoute
      path="/binnacle"
      component={BinnaclePage} />
  </Switch>
);

export default Routes;

/*
<Route
path="/"
render={() => <Redirect to="/login" />} />*/
