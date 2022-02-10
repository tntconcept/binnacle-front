import { inject, singleton } from 'tsyringe'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { OAuthRepository } from 'shared/api/oauth/oauth-repository'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import type { OAuth } from 'shared/api/oauth/OAuth'

@singleton()
export class HttpOAuthInterceptor {
  refreshTokenPromise?: Promise<OAuth> = undefined
  sessionExpiredCb: () => Promise<void>

  constructor(
    private httpClient: HttpClient,
    private authRepository: OAuthRepository,
    @inject('TokenStorage') private tokenStorage: TokenStorage
  ) {}

  initInterceptor = (sessionExpiredCb: () => Promise<void>) => {
    this.httpClient.httpInstance.interceptors.request.use(this.interceptRequest, (error) => {
      Promise.reject(error)
    })

    this.httpClient.httpInstance.interceptors.response.use(
      (response) => response,
      this.interceptResponseError
    )

    this.sessionExpiredCb = sessionExpiredCb
  }

  interceptRequest = async (config: AxiosRequestConfig) => {
    const isNotOAuthURL = config.url !== endpoints.auth

    const accessToken = this.tokenStorage.getAccessToken()
    if (accessToken && isNotOAuthURL) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`
      }
    }

    return config
  }

  // https://github.com/waltergar/react-CA/blob/5fb4bd64a8e5f2c276d14a89fe317db0b743983c/src/utils/api/axios.js
  interceptResponseError = async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config
    const isAccessTokenExpired =
      /access token expired/gi.test(error.response?.data.error_description) ||
      error.response?.status === 403

    if (error.response && isAccessTokenExpired && !originalRequest._retry) {
      try {
        originalRequest._retry = true
        const response = await this.refreshToken()
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.access_token
        return this.httpClient.httpInstance(originalRequest)
      } catch (e) {
        return Promise.reject(e)
      }
    }
    return Promise.reject(error)
  }

  async refreshToken() {
    if (this.refreshTokenPromise !== undefined) {
      return this.refreshTokenPromise
    } else {
      const refreshToken = await this.tokenStorage.getRefreshToken()
      this.refreshTokenPromise = this.authRepository
        .renewOAuthByRefreshToken(refreshToken!)
        .then(async (response) => {
          await this.tokenStorage.setRefreshToken(response.refresh_token)
          this.tokenStorage.setAccessToken(response.access_token)
          this.refreshTokenPromise = undefined
          return response
        })
        .catch((e) => {
          this.refreshTokenPromise = undefined
          const isRefreshTokenExpired = /refresh token \(expired\)/gi.test(
            e.response?.data.error_description
          )
          if (isRefreshTokenExpired) {
            this.sessionExpiredCb()
            return Promise.reject(e)
          }
          throw e
        })

      return this.refreshTokenPromise
    }
  }
}
