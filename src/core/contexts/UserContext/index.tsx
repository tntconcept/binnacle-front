import React from "react"
import {Redirect} from "react-router-dom"
import {AuthContext} from "features/Authentication/Authentication"
import {IUser} from "api/interfaces/IUser"
import {useAsyncResource} from "use-async-resource"
import {getLoggedUser} from "api/UserAPI"

export const UserContext = React.createContext<IUser>(undefined!);

export class UserErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <AuthContext.Consumer>
          {auth => {
            auth.handleLogout();
            return <Redirect to="/" />;
          }}
        </AuthContext.Consumer>
      );
    }
    return this.props.children;
  }
}

export const UserProvider: React.FC = props => {
  const [userReader] = useAsyncResource(getLoggedUser, [])

  return (
    <UserContext.Provider value={userReader()}>{props.children}</UserContext.Provider>
  );
};
