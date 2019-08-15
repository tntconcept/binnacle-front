import React, { useContext } from "react";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import { getLoggedUser, getOAuthToken } from "services/authService";
import getErrorMessage from "utils/apiErrorMessage";
import { saveToken } from "core/contexts/AuthContext/tokenUtils";

interface IUser {
  username: string;
}

interface Auth {
  isAuthenticated: boolean;
  user?: IUser;
  remember: boolean;
  handleLogin(username: string, password: string): Promise<boolean>;
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

  const handleLogin = async (username: string, password: string) => {
    try {
      const authResponse = await getOAuthToken(username, password);
      saveToken(authResponse.data.access_token, "access_token");
      const userResponse = await getLoggedUser();
      console.log("Logged");
      return true;
    } catch (error) {
      addNotification(getErrorMessage(error)!);
    }
    return false;
  };

  const handleLogout = () => {};

  return (
    <AuthContext.Provider
      value={{
        remember: false,
        isAuthenticated: false,
        user: undefined,
        handleLogin,
        handleLogout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
