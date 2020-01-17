import React, {useContext, useState} from "react"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "utils/apiErrorMessage"
import {getToken, removeToken} from "core/contexts/AuthContext/tokenUtils"
import {login, storeToken} from "services/fetchClient"

interface Auth {
  isAuthenticated: boolean;
  remember: boolean;
  handleLogin(username: string, password: string): Promise<void>;
  handleLogout(): void;
}

export const AuthContext = React.createContext<Auth>({
  isAuthenticated: false,
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

  // console.log("isAuthenticated", getToken("access_token") ? true : false);

  const [authenticated, setAuthenticated] = useState(
    getToken("access_token") ? true : false
  );

  const handleLogin = async (username: string, password: string) => {
    try {
      const authResponse = await login(username, password);
      // saveToken(authResponse.access_token, "access_token");
      storeToken({
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token
      })
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
        handleLogin,
        handleLogout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
