import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { HttpClient } from './http-client'
import { singleton } from 'tsyringe'

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

  interceptResponseError = async (error: AxiosError) => {
    const url = error.config?.url
    const REFRESH_TOKEN_URL = '/api/oauth/access_token'
    const isInvalidUrl = url !== '/api/user/me' && url !== REFRESH_TOKEN_URL
    const isSessionExpired = error.response?.status === 401 && isInvalidUrl
    const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } = error.config!

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
