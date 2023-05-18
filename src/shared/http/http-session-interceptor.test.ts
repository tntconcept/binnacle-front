import { HttpClient } from 'shared/http/http-client'
import { mockDeep } from 'jest-mock-extended'
import { HttpSessionInterceptor } from './http-session-interceptor'
import { AxiosError } from 'axios'

describe('HttpSessionInterceptor', () => {
  it('should be instanciate correctly', () => {
    const { httpSessionInterceptor, callback } = setup()

    httpSessionInterceptor.initInterceptor(callback)

    expect(httpSessionInterceptor.sessionExpiredCb).toEqual(callback)
  })

  it('should intercept an error response and the refresh token', async () => {
    const { httpSessionInterceptor, httpClient, callback } = setup()
    const url = 'any-url'
    const originalResponse: AxiosError = {
      response: { status: 401 },
      config: { url },
      isAxiosError: true
    } as AxiosError
    const updateTokenResponse = {
      response: { status: 200 }
    }
    jest.spyOn(httpClient.httpInstance, 'post').mockResolvedValue(updateTokenResponse)
    jest.spyOn(httpClient.httpInstance, 'request').mockResolvedValue('any-value')

    httpSessionInterceptor.initInterceptor(callback)

    return httpSessionInterceptor
      .interceptResponseError(originalResponse)
      .then((response) => {
        expect(response).toBe('any-value')
        expect(httpClient.httpInstance.request).toHaveBeenCalled()
      })
      .catch((error) => expect(error).toBeFalsy())
  })

  it('should intercept an error response and execute the caller', async () => {
    const { httpSessionInterceptor, httpClient, callback } = setup()
    const url = 'any-url'
    const originalResponse: AxiosError = {
      response: { status: 401 },
      config: { url },
      isAxiosError: true
    } as AxiosError
    const updateTokenUrl = 'api/oauth/access_token'
    const updateTokenResponse: AxiosError = {
      response: { status: 401 },
      config: { url: updateTokenUrl },
      isAxiosError: true
    } as AxiosError
    jest.spyOn(httpClient.httpInstance, 'post').mockRejectedValue(updateTokenResponse)

    httpSessionInterceptor.initInterceptor(callback)

    return httpSessionInterceptor.interceptResponseError(originalResponse).catch(() => {
      expect(httpSessionInterceptor.sessionExpiredCb).toHaveBeenCalled()
    })
  })
})

function setup() {
  const httpClient = mockDeep<HttpClient>()
  const callback = jest.fn()

  return {
    httpSessionInterceptor: new HttpSessionInterceptor(httpClient),
    httpClient,
    callback
  }
}
