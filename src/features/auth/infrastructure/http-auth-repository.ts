import { HttpClient } from '../../../shared/http/http-client'
import { singleton } from 'tsyringe'
import { AuthRepository } from '../domain/auth-repository'

@singleton()
export class HttpAuthRepository implements AuthRepository {
  protected static logoutPath = '/logout'

  constructor(private httpClient: HttpClient) {}

  async logout(): Promise<void> {
    return this.httpClient.post<void>(HttpAuthRepository.logoutPath)
  }
}
