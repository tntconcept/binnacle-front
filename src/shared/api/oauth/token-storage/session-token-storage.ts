import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { STORAGE } from 'shared/data-access/ioc-container/ioc-container.types'
import { inject, singleton } from 'tsyringe'

@singleton()
export class SessionTokenStorage implements TokenStorage {
  static KEY = 'binnacle_token'
  private accessToken: string | undefined = undefined

  constructor(@inject(STORAGE) private storage: Storage) {}

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }

  getAccessToken(): string | undefined {
    return this.accessToken
  }

  async setRefreshToken(refreshToken: string) {
    this.storage.setItem(SessionTokenStorage.KEY, refreshToken)
  }

  async getRefreshToken(): Promise<string | undefined> {
    const refreshToken = this.storage.getItem(SessionTokenStorage.KEY)
    return refreshToken !== null ? refreshToken : undefined
  }

  clearTokens = async () => {
    this.accessToken = undefined
    this.storage.removeItem(SessionTokenStorage.KEY)
  }
}
