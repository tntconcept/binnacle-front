import ky from "ky/umd"
import {TokenService} from "services/TokenService"
import {IOAuth} from "api/interfaces/IOAuth"
import {refreshToken} from "api/OAuthAPI"

//TODO: ¡THIS WHOLE FOLDER IS A SERVICE!

// If a refresh token promise is already running use that promise instead of creating another one.
let refreshTokenPromise: Promise<IOAuth> | undefined = undefined
const getRefreshTokenInstance = () => refreshTokenPromise || (refreshTokenPromise = (async () => {
  try {
    return await refreshToken()
  } catch (e) {
    refreshTokenPromise = undefined
    throw e
  }
})())


export const baseHttpClient = ky.create({
  prefixUrl: process.env.REACT_APP_API_URL,
  timeout: 10_000,
  // Do NOT retry any request
  retry: 0,
  throwHttpErrors: true
});

const HttpClient = baseHttpClient.extend({
  hooks: {
    beforeRequest: [
      (request, options) => {
        request.headers.set("Authorization", `Bearer ${TokenService.getTokens().access_token}`);
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          try {
            const token = await getRefreshTokenInstance();
            refreshTokenPromise = undefined
            request.headers.set("Authorization", `Bearer ${token.access_token}`)
            return ky(request)
          } catch (e) {
            TokenService.removeTokens()
            return response
          }
        }
        return response
      }
    ]
  }
});

export default HttpClient
