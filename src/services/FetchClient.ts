import Cookies from "js-cookie"
import {AUTH_ENDPOINT, USER_ENDPOINT} from "services/endpoints"
import {IUser} from "interfaces/IUser"
import {IOAuthResponse} from "interfaces/IOAuthResponse"
import ky from "ky/umd"

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
  password: "hola"
}

const base64Credentials = btoa(OAuthClientCredentials.username + ":" + OAuthClientCredentials.password)

export let inMemoryToken = "";

let refreshTokenPromise: Promise<IOAuthResponse> | undefined = undefined
const getRefreshTokenInstance = () => refreshTokenPromise || (refreshTokenPromise = (async () => {
  try {
    return await refreshToken()
  } catch (e) {
    refreshTokenPromise = undefined
    throw e
  }
})())

const baseApi = ky.create({
  prefixUrl: process.env.REACT_APP_API_URL,
  timeout: 10_000,
  retry: 0,
  throwHttpErrors: true,
});

const api = baseApi.extend({
  hooks: {
    beforeRequest: [
      (request, options) => {
        request.headers.set("Authorization", `Bearer ${inMemoryToken}`);
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
            removeToken()
            return response
          }
        }

        return response
      }
    ]
  }
});

export const login = async (username: string, password: string) => {
  const response =  await baseApi.post(AUTH_ENDPOINT, {
    searchParams: {
      grant_type: "password",
      username: username,
      password: password
    },
    headers: {
      Authorization: `Basic ${base64Credentials}`
    },
  }).json<IOAuthResponse>()
  inMemoryToken = response.access_token
  storeToken({
    access_token: response.access_token,
    refresh_token: response.refresh_token
  });

  return response
};

const refreshToken = async () => {
  const response = await baseApi.post(AUTH_ENDPOINT, {
    headers: {
      Authorization: `Basic ${base64Credentials}`
    },
    searchParams: {
      grant_type: "refresh_token",
      refresh_token: retrieveToken().refresh_token
    }
  }).json<IOAuthResponse>()

  inMemoryToken = response.access_token

  storeToken({
    access_token: response.access_token,
    refresh_token: response.refresh_token
  })

  return response
};

export const getLoggedUser = async () => await api(USER_ENDPOINT).json<IUser>()

export const fetchClient = api