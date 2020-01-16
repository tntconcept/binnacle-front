import Cookies from 'js-cookie'
import {configureRefreshFetch, fetchJSON} from 'refresh-fetch'

const COOKIE_NAME = 'BINNACLE'

const retrieveToken = () => Cookies.get(COOKIE_NAME)
const saveToken = (token: string) => Cookies.set(COOKIE_NAME, token)
const clearToken = () => Cookies.remove(COOKIE_NAME)

const fetchJSONWithToken = <T>(url: string, options = {}) => {
  const token = retrieveToken()

  let optionsWithToken = options
  if (token != null) {
    optionsWithToken = {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  return fetchJSON<T>(url, optionsWithToken)
}

const login = (username: string, password: string) => {
  return fetchJSON<{token: string}>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(response => {
      console.log(response)
      saveToken(response.body.token)
    })
}

const logout = () => {
  return fetchJSONWithToken('/api/auth/logout', {
    method: 'POST'
  })
    .then(() => {
      clearToken()
    })
}

const shouldRefreshToken = (error: any) =>
  error.response.status === 401 &&
  error.body.message === 'Token has expired'

const refreshToken = () => {
  return fetchJSONWithToken<{token: string}>('/api/auth/refresh-token', {
    method: 'POST'
  })
    .then(response => {
      saveToken(response.body.token)
    })
    .catch(error => {
      // Clear token and continue with the Promise catch chain
      clearToken()
      throw error
    })
}

const fetch = configureRefreshFetch({
  fetch: fetchJSONWithToken,
  shouldRefreshToken,
  refreshToken
})

export {
  fetch,
  login,
  logout
}