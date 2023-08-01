export const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || window.location.origin) +
  (import.meta.env.VITE_API_SUBDIRECTORY_PATH || '').slice(0, -1)

export const googleLoginUrl = `${BASE_URL}/oauth/login/google`
