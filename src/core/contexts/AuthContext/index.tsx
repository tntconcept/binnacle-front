import React, { useContext, useState } from "react";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import getErrorMessage from "api/HttpClient/HttpErrorMapper";
import { login } from "api/OAuthAPI";
import { TokenService } from "services/TokenService";
import { useHistory } from "react-router-dom";
import { cache } from "swr";

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
  const showNotification = useContext(NotificationsContext);
  const [authenticated, setAuthenticated] = useState(false);
  const history = useHistory();

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
            showNotification(
              getErrorMessage({
                // @ts-ignore
                response: new Response(null, {
                  status: 401
                })
              })
            );
          } else {
            showNotification(getErrorMessage(error)!);
          }
        });
      } else {
        showNotification(getErrorMessage(error)!);
      }
      throw error;
    }
  };

  const handleLogout = () => {
    cache.clear();
    TokenService.removeTokens();
    setAuthenticated(false);
    history.push("/login");
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
