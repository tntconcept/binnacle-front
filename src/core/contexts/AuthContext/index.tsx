import React, {useContext, useState} from "react"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "utils/FetchErrorHandling"
import {removeToken} from "core/contexts/AuthContext/tokenUtils"
import {login} from "services/FetchClient"

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
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      setAuthenticated(true);
    } catch (error) {
      if (error.response) {
        error.response.json().then((body: any) => {
          if (
            error.response.status === 400 &&
            body.error_description === "Bad credentials"
          ) {
            addNotification(
              getErrorMessage({
                // @ts-ignore
                response: new Response(null, {
                  status: 401
                })
              })
            );
          } else {
            addNotification(getErrorMessage(error)!);
          }
        });
      }
      throw error
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
