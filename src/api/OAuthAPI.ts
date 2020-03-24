import {IOAuth} from "api/interfaces/IOAuth"
import {baseHttpClient} from "api/HttpClient"
import {TokenService} from "services/TokenService"
import endpoints from "api/endpoints"

const OAuthClientCredentials = {
  username: process.env.REACT_APP_CLIENT_NAME,
  password: process.env.REACT_APP_CLIENT_SECRET
}

const base64Credentials = btoa(OAuthClientCredentials.username + ":" + OAuthClientCredentials.password)

export const login = async (username: string, password: string) => {
  const response =  await baseHttpClient.post(endpoints.auth, {
    searchParams: {
      grant_type: "password",
      username: username,
      password: password
    },
    headers: {
      Authorization: `Basic ${base64Credentials}`
    },
  }).json<IOAuth>()

  TokenService.storeTokens(response.access_token, response.refresh_token)
  return response
};

export const refreshToken = async () => {
  const response = await baseHttpClient.post(endpoints.auth, {
    headers: {
      Authorization: `Basic ${base64Credentials}`
    },
    searchParams: {
      grant_type: "refresh_token",
      refresh_token: TokenService.getTokens().refresh_token!
    }
  }).json<IOAuth>()

  TokenService.storeTokens(response.access_token, response.refresh_token)
  return response
};

