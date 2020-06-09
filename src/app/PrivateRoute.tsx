import React, {useContext} from "react"
import {AuthContext} from "features/Authentication/Authentication"
import {Redirect, Route, RouteProps} from "react-router-dom"
import {UserErrorBoundary, UserProvider} from "core/contexts/UserContext"

interface MyRouteProps extends Omit<RouteProps, "component"> {
  component: any;
}

export const PrivateRoute: React.FC<MyRouteProps> = ({
  component: ComponentWrapped,
  ...rest
}) => {

  const {isAuthenticated} = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated ? (
          <UserErrorBoundary>
            <UserProvider>
              <ComponentWrapped {...props} />
            </UserProvider>
          </UserErrorBoundary>
        ): <Redirect to="/"/>
      )}
    />
  )
}