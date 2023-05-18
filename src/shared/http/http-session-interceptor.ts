import { singleton } from 'tsyringe'
import { AxiosError } from 'axios'
import { HttpClient } from 'shared/http/http-client'

@singleton()
export class HttpSessionInterceptor {
  sessionExpiredCb: () => Promise<void>

  constructor(private httpClient: HttpClient) {}

  initInterceptor = (sessionExpiredCb: () => Promise<void>) => {
    this.httpClient.httpInstance.interceptors.response.use(
      (response) => response,
      this.interceptResponseError
    )

    this.sessionExpiredCb = sessionExpiredCb
  }

  // https://github.com/waltergar/react-CA/blob/5fb4bd64a8e5f2c276d14a89fe317db0b743983c/src/utils/api/axios.js
  interceptResponseError = async (error: AxiosError) => {
    const { url } = error.config
    const REFRESH_TOKEN_URL = 'api/oauth/access_token'
    const isInvalidUrl = url !== 'api/user/me' && url !== REFRESH_TOKEN_URL
    const isSessionExpired = error.response?.status === 401 && isInvalidUrl
    const originalRequest = error.config as any

    if (isSessionExpired && !originalRequest._retry) {
      try {
        await this.httpClient.httpInstance.post(REFRESH_TOKEN_URL)
        originalRequest._retry = true
        return this.httpClient.httpInstance.request(originalRequest)
      } catch (error) {
        if (error.response.status === 401) {
          return this.sessionExpiredCb()
        }

        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
}
