// Code from https://github.com/Flyrell/axios-auth-refresh
/** @type {Object} */
import { AxiosError, AxiosInstance } from "axios";
import { axiosClient } from "services/axiosClient";
import { getToken, saveToken } from "core/contexts/AuthContext/tokenUtils";
import { refreshOAuthToken } from "services/authService";

const defaults = {
  /** @type {Number[]} */
  statusCodes: [
    401 // Unauthorized
  ]
};

let _refreshCall: any = null;

/**
 * Creates an authentication refresh interceptor that binds to any error response.
 * If the response code is 401, interceptor tries to call the refreshTokenCall which must return a Promise.
 * While refreshTokenCall is running, all new requests are intercepted and waiting for it to resolve.
 * After Promise is resolved/rejected the authentication refresh interceptor is revoked.
 * @param {AxiosInstance|Function} axios - axios instance
 * @param {Function} refreshTokenCall - refresh token call which must return a Promise
 * @param retryCondition
 * @return {AxiosInstance}
 */
function createAuthRefreshInterceptor(
  axios: AxiosInstance,
  refreshTokenCall: (error: AxiosError) => Promise<any>,
  retryCondition?: () => boolean | undefined
) {
  const id = axios.interceptors.response.use(
    res => res,
    error => {
      // Reject promise if the error status is not in options.ports or defaults.ports
      const statusCodes = defaults.statusCodes;

      if (
        !error.response ||
        (error.response.status &&
          statusCodes!.indexOf(+error.response.status) === -1)
      ) {
        return Promise.reject(error);
      }

      // Reject promise if the custom condition is not satisfied (default: always retry)
      const retry =
        typeof retryCondition === "function" ? retryCondition() : true;

      if (!retry) {
        return Promise.reject(error);
      }

      // Remove the interceptor to prevent a loop
      // in case token refresh also causes the 401
      axios.interceptors.response.eject(id);

      const refreshCall = _refreshCall ? _refreshCall : refreshTokenCall(error);

      // Create interceptor that will bind all the others requests
      // until refreshTokenCall is resolved
      const requestQueueInterceptorId = axios.interceptors.request.use(
        request => refreshCall.then(() => request)
      );

      // When response code is 401 (Unauthorized), try to refresh the token.
      return refreshCall
        .then(() => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return axios(error.response.config);
        })
        .catch((error: any) => {
          axios.interceptors.request.eject(requestQueueInterceptorId);
          return Promise.reject(error);
        })
        .finally(() => {
          _refreshCall = null;
          createAuthRefreshInterceptor(axios, refreshTokenCall);
        });
    }
  );
  return axios;
}

// Function that will be called to determine whether to attempt refresh
const retryAuthCondition = () => !!getToken("access_token");

const refreshAuthLogic = () => {
  const refreshToken = getToken("refresh_token");
  return refreshOAuthToken(refreshToken!).then(response => {
    saveToken(response.data.access_token, "access_token");
    return Promise.resolve();
  });
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axiosClient, refreshAuthLogic, retryAuthCondition);
