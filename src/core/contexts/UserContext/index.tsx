import React from "react"
import {Redirect} from "react-router-dom"
import {AuthContext} from "core/contexts/AuthContext"
import {IUser} from "api/interfaces/IUser"
import useSWR from "swr"
import endpoints from "api/endpoints"
import httpClient from "api/HttpClient"

export const UserContext = React.createContext<IUser>(undefined!);

export const fetcher = async (key: string, ...rest: any): Promise<any> => {
  return await httpClient.get(key).json();
};

const useUserResource = () => {
  return useSWR<IUser>(endpoints.user, fetcher, { suspense: true, revalidateOnFocus: false, shouldRetryOnError: false, refreshWhenHidden: false });
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
  const {data} = useUserResource()

  return (
    <UserContext.Provider value={data!}>{props.children}</UserContext.Provider>
  );
};
