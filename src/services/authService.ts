import { axiosClient } from "services/axiosClient";

interface IResponseToken {
  access_token: string;
  token_type: "bearer";
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
}

export interface IUser {
  id: number;
  username: string;
  name: string;
  departmentId: number;
  email?: string;
  genre: string;
  hiringDate: string; // Todo maybe i need to change to date and map the string to date
  photoUrl?: string;
  role: {
    id: number;
    name: string;
  };
  dayDuration?: number;
}

const authCredentials = {
  username: "tnt-client",
  password: "Client-TNT-v1"
};

export const getOAuthToken = async (username: string, password: string) =>
  await axiosClient.post<IResponseToken>("oauth/token", undefined, {
    params: {
      grant_type: "password",
      username: username,
      password: password
    },
    auth: authCredentials
  });

export const refreshOAuthToken = async (refreshToken: string) =>
  await axiosClient.request<IResponseToken>({
    method: "post",
    url: "oauth/token",
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    auth: authCredentials
  });

export const getLoggedUser = async () =>
  await axiosClient.get<IUser>("api/user");
