export const BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || window.location.origin) +
  (process.env.REACT_APP_API_SUBDIRECTORY_PATH || '').slice(0, -1)

export const googleLoginUrl = `${BASE_URL}/oauth/login/google`
