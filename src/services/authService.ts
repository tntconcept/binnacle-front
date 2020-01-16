import {AUTH_ENDPOINT, USER_ENDPOINT} from "services/endpoints"
import {IOAuthResponse} from "interfaces/IOAuthResponse"
import {IUser} from "interfaces/IUser"


export const getOAuthToken = async (username: string, password: string) =>
  await axiosClient.post<IOAuthResponse>(AUTH_ENDPOINT, undefined, {
    params: {
      grant_type: "password",
      username: username,
      password: password
    },
    auth: authCredentials
  });

/*export const refreshOAuthToken = async (refreshToken: string) =>
  await axiosClient.request<IResponseToken>({
    method: "post",
    url: AUTH_ENDPOINT,
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    auth: authCredentials
  });*/

export const refreshOAuthToken = async (refreshToken: string) =>
  await axiosClient.post<IOAuthResponse>(AUTH_ENDPOINT, undefined, {
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    auth: authCredentials
  });

export const getLoggedUser = async () =>
  await axiosClient.get<IUser>(USER_ENDPOINT);
