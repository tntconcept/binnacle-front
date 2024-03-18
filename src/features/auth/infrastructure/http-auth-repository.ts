import { HttpClient } from '../../../shared/http/http-client'
import { singleton } from 'tsyringe'
import { AuthRepository } from '../domain/auth-repository'
import { UserCredentials } from '../domain/user-credentials'

@singleton()
export class HttpAuthRepository implements AuthRepository {
  protected static logoutPath = '/logout'
  protected static loginPath = '/login'

  constructor(private httpClient: HttpClient) {}

  async logout(): Promise<void> {
    return this.httpClient.post<void>(HttpAuthRepository.logoutPath)
  }

  async login(userCredentials: UserCredentials): Promise<void> {
    return this.httpClient.post(HttpAuthRepository.loginPath, { data: userCredentials })
  }
}
