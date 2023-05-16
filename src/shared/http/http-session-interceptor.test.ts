import { HttpClient } from 'shared/http/http-client'
import { mockDeep } from 'jest-mock-extended'
import { HttpSessionInterceptor } from './http-session-interceptor'

describe('HttpSessionInterceptor', () => {
  it('should be instanciate correctly', () => {
    const { httpSessionInterceptor } = setup()
    const callback = jest.fn()

    httpSessionInterceptor.initInterceptor(callback)

    expect(httpSessionInterceptor.sessionExpiredCb).toEqual(callback)
  })
})

function setup() {
  const mockHttpClient = mockDeep<HttpClient>()

  return {
    httpSessionInterceptor: new HttpSessionInterceptor(mockHttpClient)
  }
}
