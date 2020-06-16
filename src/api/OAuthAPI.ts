import { IOAuth } from 'api/interfaces/IOAuth'
import { baseHttpClient } from 'services/HttpClient'
import { TokenService } from 'services/TokenService'
import endpoints from 'api/endpoints'

const OAuthClientCredentials = {
  username: process.env.REACT_APP_CLIENT_NAME,
  password: process.env.REACT_APP_CLIENT_SECRET
}

const base64Credentials = btoa(
  OAuthClientCredentials.username + ':' + OAuthClientCredentials.password
)

export const login = async (username: string, password: string) => {
  const searchParams = new URLSearchParams()
  searchParams.set('grant_type', 'password')
  searchParams.set('username', username)
  searchParams.set('password', password)

  const response = await baseHttpClient
    .post(endpoints.auth, {
      body: searchParams,
      headers: {
        Authorization: `Basic ${base64Credentials}`
      }
    })
    .json<IOAuth>()

  TokenService.storeTokens(response.access_token, response.refresh_token)
  return response
}

export const refreshToken = async () => {
  const response = await baseHttpClient
    .post(endpoints.auth, {
      headers: {
        Authorization: `Basic ${base64Credentials}`
      },
      searchParams: {
        grant_type: 'refresh_token',
        refresh_token: TokenService.getTokens().refresh_token!
      }
    })
    .json<IOAuth>()

  TokenService.storeTokens(response.access_token, response.refresh_token)
  return response
}
