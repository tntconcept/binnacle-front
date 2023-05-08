import type { User } from 'shared/api/users/User'
import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { AnonymousUserError } from '../domain/anonymous-user-error'
import { UserRepository } from '../domain/user-repository'

@singleton()
export class HttpUserRepository implements UserRepository {
  protected static userMePath = '/api/user/me'
  protected static logoutPath = '/logout'

  constructor(private httpClient: HttpClient) {}

  async getUser(): Promise<User> {
    try {
      const user = await this.httpClient.get<User>(HttpUserRepository.userMePath)
      return user
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        throw new AnonymousUserError()
      }

      throw error
    }
  }

  async logout(): Promise<void> {
    return this.httpClient.post<void>(HttpUserRepository.logoutPath)
  }
}
