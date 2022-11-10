import { Nullable } from 'shared/types/Nullable'

export interface TokenStorage {
  setAccessToken: (value: string) => void
  getAccessToken: () => Nullable<string>

  setRefreshToken: (value: string) => Promise<void>
  getRefreshToken: () => Promise<Nullable<string>>
  clearTokens: () => Promise<void>
}
