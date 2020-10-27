import ky from 'ky/umd'
import { TokenService } from 'core/services/TokenService'
import { IOAuth } from 'core/api/interfaces'
import { refreshToken } from 'core/api/oauth'
import { parseISO } from 'core/services/Chrono'
import { parseJSON } from 'date-fns'

// If a refresh token promise is already running use that promise instead of creating another one.
let refreshTokenPromise: Promise<IOAuth> | undefined = undefined
const getRefreshTokenInstance = () =>
  refreshTokenPromise ||
  (refreshTokenPromise = (async () => {
    try {
      return await refreshToken()
    } catch (e) {
      refreshTokenPromise = undefined
      throw e
    }
  })())

const PREFIX_URL =
  (process.env.REACT_APP_API_BASE_URL || window.location.origin) +
  (process.env.REACT_APP_API_SUBDIRECTORY_PATH || '')

export function dateReviver(key: string, value: any): Date | any {
  const isISO8601Z = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/
  const isDateTime = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
  const isDate = /^(\d{4})-(\d{2})-(\d{2})/
  if (typeof value === 'string') {
    if (isISO8601Z.test(value) || isDateTime.test(value)) {
      return parseJSON(value)
    }
    const c = isDate.exec(value)
    if (c) {
      return new Date(Date.UTC(+c[1], +c[2] - 1, +c[3]))
    }

    return value
  }

  return value
}

export const baseHttpClient = ky.create({
  prefixUrl: PREFIX_URL,
  timeout: 10_000,
  // Do NOT retry any request
  retry: 0,
  throwHttpErrors: true
})

const HttpClient = baseHttpClient.extend({
  hooks: {
    beforeRequest: [
      (request, options) => {
        request.headers.set('Authorization', `Bearer ${TokenService.getTokens().access_token}`)
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          try {
            const token = await getRefreshTokenInstance()
            refreshTokenPromise = undefined
            request.headers.set('Authorization', `Bearer ${token.access_token}`)
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
})

export default HttpClient
