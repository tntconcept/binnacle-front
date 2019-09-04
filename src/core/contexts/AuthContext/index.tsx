import React, { useContext, useState } from "react";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import { getLoggedUser, getOAuthToken } from "services/authService";
import getErrorMessage from "utils/apiErrorMessage";
import {
  getToken,
  removeToken,
  saveToken
} from "core/contexts/AuthContext/tokenUtils";

interface IUser {
  username: string;
}

interface Auth {
  isAuthenticated: boolean;
  user?: IUser;
  remember: boolean;
  handleLogin(username: string, password: string): Promise<void>;
  handleLogout(): void;
}

export const AuthContext = React.createContext<Auth>({
  isAuthenticated: false,
  user: undefined,
  remember: false,
  handleLogin(username: string, password: string) {
    return Promise.reject("login() not implemented");
  },
  handleLogout() {
    return Error("logout() not implemented");
  }
});

export const AuthProvider: React.FC = props => {
  const addNotification = useContext(NotificationsContext);

  console.log("isAuthenticted", getToken("access_token") ? true : false);

  const [authenticated, setAuthenticated] = useState(
    getToken("access_token") ? true : false
  );

  const handleLogin = async (username: string, password: string) => {
    try {
      const authResponse = await getOAuthToken(username, password);
      saveToken(authResponse.data.access_token, "access_token");
      const userResponse = await getLoggedUser();
      setAuthenticated(true);
    } catch (error) {
      addNotification(getErrorMessage(error)!);
      throw error;
    }
  };

  const handleLogout = () => {
    removeToken("access_token");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        remember: false,
        isAuthenticated: authenticated,
        user: undefined,
        handleLogin,
        handleLogout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
