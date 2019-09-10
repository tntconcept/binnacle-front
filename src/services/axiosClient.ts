import axios, { AxiosInstance } from "axios";
import { getToken } from "core/contexts/AuthContext/tokenUtils";
import {
  createAuthRefreshInterceptor,
  refreshAuthLogic,
  retryAuthCondition
} from "services/axiosInterceptors";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000
});

axiosInstance.interceptors.request.use(
  requestConfig => {
    const accessToken = getToken("access_token");
    if (accessToken) {
      requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return requestConfig;
  },
  error => Promise.reject(error)
);

export const axiosClient = createAuthRefreshInterceptor(
  axiosInstance,
  refreshAuthLogic,
  retryAuthCondition
);
