import { HttpClient } from '../../../shared/http/http-client'
import { singleton } from 'tsyringe'
import { AuthRepository } from '../domain/auth-repository'
import { UserCredentials } from '../domain/user-credentials'
import { BASE_URL } from '../../../shared/api/url'

@singleton()
export class HttpAuthRepository implements AuthRepository {
  protected static logoutPath = '/logout'
  protected static loginPath = '/login'

  constructor(private httpClient: HttpClient) {}

  async logout(): Promise<void> {
    return this.httpClient.post<void>(HttpAuthRepository.logoutPath)
  }

  async login({ username, password }: UserCredentials): Promise<void> {
    await fetch(`${BASE_URL}${HttpAuthRepository.loginPath}`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      redirect: 'manual',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => Promise.resolve())
    return
  }
}
