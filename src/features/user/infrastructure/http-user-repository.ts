import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { UserRepository } from '../domain/user-repository'
import { UserInfo } from '../domain/user-info'
import { AnonymousUserError } from 'features/shared/user/domain/anonymous-user-error'

@singleton()
export class HttpUserRepository implements UserRepository {
  protected static usersPath = '/api/user'
  protected static logoutPath = '/logout'

  constructor(private httpClient: HttpClient) {}

  async logout(): Promise<void> {
    return this.httpClient.post<void>(HttpUserRepository.logoutPath)
  }

  async getUsers(): Promise<UserInfo[]> {
    try {
      return await this.httpClient.get<UserInfo[]>(HttpUserRepository.usersPath)
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        throw new AnonymousUserError()
      }

      throw error
    }
  }
}
