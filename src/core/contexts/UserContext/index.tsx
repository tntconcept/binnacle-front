import React, {useContext} from "react"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import {Redirect} from "react-router-dom"
import {AuthContext} from "core/contexts/AuthContext"
import {IUser} from "api/interfaces/IUser"
import useSWR from "swr"
import endpoints from "api/endpoints"
import httpClient from "api/HttpClient"

export const UserContext = React.createContext<IUser>(undefined!);

export const fetcher = async (key: string, ...rest: any): Promise<any> => {
  console.log(key, rest);
  return await httpClient.get(key).json();
};

const useUserResource = () => {
  return useSWR<IUser>(endpoints.user, fetcher, { suspense: true });
};


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
            return <Redirect to="/login" />;
          }}
        </AuthContext.Consumer>
      );
    }
    return this.props.children;
  }
}

export const UserProvider: React.FC = props => {
  const showNotification = useContext(NotificationsContext);
  const {data} = useUserResource()
  // const data = resource.user.read()
  /*
   *
   * showNotification(error!);
   *  */

  return (
    <UserContext.Provider value={data!}>{props.children}</UserContext.Provider>
  );
};
