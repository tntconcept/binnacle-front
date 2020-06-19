import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import { fetchLoggedUser } from 'api/UserAPI'
import { buildOAuthResource } from 'utils/generateTestMocks'
import { TokenService } from 'services/TokenService'

enableFetchMocks()

describe('HttpClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should intercept the 401 response and refresh the token successfully', async () => {
    TokenService.storeTokens = jest.fn()
    const oauthResource = buildOAuthResource()

    fetchMock.mockResponses(
      ['mock response for fetchLoggedUser() first call', { status: 401 }],
      [
        // mock response for refreshToken() call
        // refresh the token and then retries the user request
        JSON.stringify(oauthResource),
        { status: 200 }
      ],
      [
        // "mock response for fetchLoggedUser() second call"
        JSON.stringify({ id: 100 }),
        { status: 200 }
      ]
    )

    const result = await fetchLoggedUser()

    expect(result).toEqual({ id: 100 })
    expect(TokenService.storeTokens).toHaveBeenCalledWith(
      oauthResource.access_token,
      oauthResource.refresh_token
    )
    expect(fetchMock.mock.calls.length).toBe(3)
  })

  it('should throw error of refresh token request when the original request fails', async () => {
    fetchMock.mockResponses(
      ['mock response for fetchLoggedUser()', { status: 401 }],
      ['mock response for refreshToken()', { status: 500 }]
    )

    await expect(fetchLoggedUser()).rejects.toMatchInlineSnapshot(
      '[HTTPError: Unauthorized]'
    )

    expect(fetchMock.mock.calls.length).toBe(2)
  })

  it('should not fetch refresh token when the request fails with a status code different than 401', async () => {
    fetchMock.mockResponseOnce('mock response for fetchLoggedUser()', {
      status: 400
    })

    await expect(fetchLoggedUser()).rejects.toMatchInlineSnapshot(
      `[HTTPError: Bad Request]`
    )

    expect(fetchMock.mock.calls.length).toBe(1)
  })

  // Skipped because is to slow to run...
  it.skip('should timeout the request', async () => {
    jest.setTimeout(12_000)
    const delayResponse = (res: any, delay: number): Promise<any> =>
      new Promise((resolve) => setTimeout(() => resolve(res), delay))

    // timeout config is set to 10_000, so we wait a bit longer in order to throw the timeout.
    fetchMock.mockResponseOnce(() =>
      delayResponse(JSON.stringify({ 1: 200 }), 11_000)
    )

    await expect(fetchLoggedUser()).rejects.toMatchInlineSnapshot(
      '[TimeoutError: Request timed out]'
    )
  })
})
