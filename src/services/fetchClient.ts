import wretch from "wretch"
import Cookies from "js-cookie"
import {AUTH_ENDPOINT, USER_ENDPOINT} from "services/endpoints"
import {IUser} from "interfaces/IUser"
import {IOAuthResponse} from "interfaces/IOAuthResponse"

const COOKIE_NAME = "BINNACLE"

interface ITokenCookie {
  access_token: string;
  refresh_token: string;
}

const retrieveToken = () => Cookies.getJSON(COOKIE_NAME) as ITokenCookie
export const storeToken = (token: ITokenCookie) => Cookies.set(COOKIE_NAME, token)
const removeToken = () => Cookies.remove(COOKIE_NAME)

const OAuthClientCredentials = {
  username: "tnt-client",
  password: "Client-TNT-v1"
}

const base64Credentials = btoa(OAuthClientCredentials.username + ":" + OAuthClientCredentials.password)

// Set up the base url
const baseWretch = wretch(process.env.REACT_APP_API_URL || "")
  .catcher(501, async (error, request) => {
    throw Error(`Request failed with status code ${error.status}`)
  })
  .catcher(400, async (error, request) => {
    throw Error(`Request failed with status code ${error.status}`)
  })
  .catcher(408, async (error, request) => {
    throw Error(`Request failed with status code ${error.status}`)
  }).resolve(chain => {
    return chain.setTimeout(10_000)
  })

const reAuthOn401 = baseWretch
  .auth(`Bearer ${retrieveToken()?.access_token}`)
  .catcher(401, async (error, request) => {
    try {
      // Renew credentials
      const token = await refreshToken()

      // Replay the original request with new credentials
      return request
        .auth(`Bearer ${token.access_token}`)
        .replay()
        .unauthorized(err => {
          removeToken()
          throw err
        })
        .json()
    } catch (refreshTokenError) {
      return refreshTokenError
    }
  })

export const login = async (username: string, password: string) => {
  return await baseWretch
    .url(AUTH_ENDPOINT)
    .query({
      grant_type: "password",
      username: username,
      password: password
    })
    .auth(`Basic ${base64Credentials}`)
    .post()
    .json<IOAuthResponse>()
}

const refreshToken = async () => {
  return await baseWretch
    .url(AUTH_ENDPOINT)
    .query({
      grant_type: "refresh_token",
      refresh_token: retrieveToken().refresh_token
    })
    .auth(`Basic ${base64Credentials}`)
    .post()
    .json(token => {
      storeToken({
        access_token: token.access_token,
        refresh_token: token.refresh_token
      })

      return token
    })
}

export const logout = async () => await reAuthOn401
  .url("/logout")
  .get()
  .res(() => removeToken())

export const getLoggedUser = async () =>
  await reAuthOn401
    .url(USER_ENDPOINT)
    .get()
    .json<IUser>()

export const fetchClient = reAuthOn401