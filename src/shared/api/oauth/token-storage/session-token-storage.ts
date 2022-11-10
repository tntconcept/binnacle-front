import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { Nullable } from 'shared/types/Nullable'
import { singleton } from 'tsyringe'

@singleton()
export class SessionTokenStorage implements TokenStorage {
  static REFRESH_TOKEN_KEY = 'binnacle_token'
  private ACCESS_TOKEN_KEY = 'binnacle_access_token'

  private accessToken: Nullable<string> = null

  constructor(private storage: Storage) {}

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }

  getAccessToken(): Nullable<string> {
    return this.accessToken
  }

  async setRefreshToken(refreshToken: string) {
    this.storage.setItem(SessionTokenStorage.REFRESH_TOKEN_KEY, refreshToken)
  }

  async getRefreshToken(): Promise<string | undefined> {
    const refreshToken = this.storage.getItem(SessionTokenStorage.REFRESH_TOKEN_KEY)
    return refreshToken !== null ? refreshToken : undefined
  }

  clearTokens = async () => {
    this.storage.removeItem(SessionTokenStorage.REFRESH_TOKEN_KEY)
    this.storage.removeItem(this.ACCESS_TOKEN_KEY)
  }
}
