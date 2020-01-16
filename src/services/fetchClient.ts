import wretch from "wretch"
import Cookies from "js-cookie"
import {AUTH_ENDPOINT, USER_ENDPOINT} from "services/endpoints"
import {IUser} from "interfaces/IUser"

const COOKIE_NAME = "BINNACLE"

interface ITokenCookie {
  access_token: string;
  refresh_token: string;
}

const retrieveToken = () => Cookies.getJSON(COOKIE_NAME) as ITokenCookie
const storeToken = (token: ITokenCookie) => Cookies.set(COOKIE_NAME, token)
const removeToken = () => Cookies.remove(COOKIE_NAME)

const OAuthClientCredentials = {
  username: "tnt-client", // TODO PASS BY VARIABLE
  password: "Client-TNT-v1" // TODO PASS BY VARIABLE
}

const base64Credentials = btoa(OAuthClientCredentials.username + OAuthClientCredentials.password)

const baseWretch = wretch()
  .url(process.env.REACT_APP_API_URL || "")
  .errorType("json")
  .resolve(resolver => resolver.setTimeout(10_000))

const reAuthOn401 = baseWretch
  .auth(`Bearer ${retrieveToken().access_token}`)
  .catcher(401, async (error, request) => {
    // Renew credentials
    const token = await baseWretch
      .url(AUTH_ENDPOINT)
      .query({
        grant_type: "refresh_token",
        refresh_token: retrieveToken().refresh_token
      })
      .auth(`Basic ${base64Credentials}`)
      .post()
      .json()

    if(!token) {
      console.log("xd")
      throw error
    }

    storeToken({
      access_token: token.access_token,
      refresh_token: token.refresh_token
    })

    // Replay the original request with new credentials
    return request
      .auth(`Bearer ${token.access_token}`)
      .replay()
      .unauthorized(err => {
        removeToken()
        throw err
      })
      .json()
  })

const login = async (username: string, password: string) => {
  await baseWretch
    .url(AUTH_ENDPOINT)
    .query({
      grant_type: "password",
      username: username,
      password: password
    })
    .auth(`Basic ${base64Credentials}`)
    .post()
}
const logout = reAuthOn401
  .url("/logout")
  .get()
  .res(() => removeToken())

export const getLoggedUser = async () =>
  await reAuthOn401
    .url(USER_ENDPOINT)
    .get()
    .json<IUser>();

export const fetchClient = reAuthOn401
