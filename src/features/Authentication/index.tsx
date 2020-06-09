import React, {useContext, useState} from "react"
import {useShowNotification} from "features/Notifications"
import getErrorMessage from "services/HttpClient/HttpErrorMapper"
import {login} from "api/OAuthAPI"
import {TokenService} from "services/TokenService"
import {useHistory} from "react-router-dom"
import {clearAllResourcesCache} from "use-async-resource/lib/cache"

interface Auth {
  isAuthenticated: boolean;
  remember: boolean;
  handleLogin(username: string, password: string): Promise<void>;
  handleLogout(): void;
}

export const AuthContext = React.createContext<Auth>(undefined!);

export const Authentication: React.FC = props => {
  const showNotification = useShowNotification();
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
    clearAllResourcesCache()

    TokenService.removeTokens();
    setAuthenticated(false);
    history.push("/");
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

export function useAuthentication() {
  return useContext(AuthContext)
}