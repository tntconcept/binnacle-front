import { singleton } from 'tsyringe'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'

@singleton()
export class MemoryTokenStorage implements TokenStorage {
  private accessToken: string | undefined = undefined
  private refreshToken: string | undefined = undefined

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }

  getAccessToken(): string | undefined {
    return this.accessToken
  }

  async setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken
  }

  async getRefreshToken(): Promise<string | undefined> {
    return this.refreshToken
  }

  clearTokens = async () => {
    this.accessToken = undefined
    this.refreshToken = undefined
  }
}
