import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { UserRepository } from '../domain/user-repository'

@singleton()
export class HttpUserRepository implements UserRepository {
  protected static logoutPath = '/logout'

  constructor(private httpClient: HttpClient) {}

  async logout(): Promise<void> {
    return this.httpClient.post<void>(HttpUserRepository.logoutPath)
  }
}
