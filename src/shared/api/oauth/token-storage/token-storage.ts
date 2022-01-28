export interface TokenStorage {
  setAccessToken: (value: string) => void
  getAccessToken: () => string | undefined

  setRefreshToken: (value: string) => Promise<void>
  getRefreshToken: () => Promise<string | undefined>
  clearTokens: () => Promise<void>
}
