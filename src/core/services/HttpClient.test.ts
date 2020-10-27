import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
import { buildOAuthResource } from 'test-utils/generateTestMocks'
import { TokenService } from 'core/services/TokenService'
import fetchLoggedUser from 'core/api/users'
import { dateReviver } from 'core/services/HttpClient'

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

    await expect(fetchLoggedUser()).rejects.toMatchInlineSnapshot('[HTTPError: Unauthorized]')

    expect(fetchMock.mock.calls.length).toBe(2)
  })

  it('should not fetch refresh token when the request fails with a status code different than 401', async () => {
    fetchMock.mockResponseOnce('mock response for fetchLoggedUser()', {
      status: 400
    })

    await expect(fetchLoggedUser()).rejects.toMatchInlineSnapshot(`[HTTPError: Bad Request]`)

    expect(fetchMock.mock.calls.length).toBe(1)
  })

  it('should revive the date', function() {
    const result_1 = dateReviver('startDate', '2020-12-10T07:00:00Z') as Date
    expect(result_1.toISOString()).toBe('2020-12-10T07:00:00.000Z')
    expect(result_1.getUTCHours()).toBe(7)

    const result_2 = dateReviver('startDate', '2020-12-10T07:00:00') as Date
    expect(result_2.toISOString()).toBe('2020-12-10T07:00:00.000Z')
    expect(result_2.getUTCHours()).toBe(7)

    const result_3 = dateReviver('startDate', '2020-12-10') as Date
    expect(result_3.toISOString()).toBe('2020-12-10T00:00:00.000Z')
    expect(result_3.getUTCHours()).toBe(0)
  })
})
