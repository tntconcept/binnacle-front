import axios, { AxiosInstance } from "axios";
import { getToken } from "core/contexts/AuthContext/tokenUtils";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000
});

axiosClient.interceptors.request.use(
  requestConfig => {
    const accessToken = getToken("access_token");
    if (accessToken) {
      requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return requestConfig;
  },
  error => Promise.reject(error)
);
