import React, { useContext } from "react";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import { Redirect } from "react-router-dom";
import { AuthContext } from "core/contexts/AuthContext";
import { IUser } from "api/interfaces/IUser";
import useSWR from "swr";
import endpoints from "api/endpoints";
import httpClient from "api/HttpClient";

export const UserContext = React.createContext<IUser>(undefined!);

export const fetcher = async (key: string, ...rest: any): Promise<any> => {
  console.log(key, rest);
  return await httpClient(key).json();
};

const useUser = () => {
  return useSWR<IUser>(endpoints.user, fetcher, { suspense: true });
};

export const UserProvider: React.FC = props => {
  const { handleLogout } = useContext(AuthContext);
  const showNotification = useContext(NotificationsContext);
  const { data, error } = useUser();

  /*
  *
  * showNotification(error!);
          handleLogout();
  *  */

  // TODO ErrorBoundary
  if (error) {
    return <Redirect to="/login" />;
  }

  return (
    <UserContext.Provider value={data!}>{props.children}</UserContext.Provider>
  );
};
