import endpoints from 'shared/api/endpoints'
import type { User } from 'shared/api/users/User'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { singleton } from 'tsyringe'
import { AnonymousUserError } from '../errors/anonymous-user-error'
import { UserRepository } from '../interfaces/user-repository'

@singleton()
export class HttpUserRepository implements UserRepository {
  constructor(private httpClient: HttpClient) {}

  async getUser(): Promise<User> {
    try {
      const user = await this.httpClient.get<User>(endpoints.user)
      return user
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        throw new AnonymousUserError()
      }

      throw error
    }
  }

  async logout(): Promise<void> {
    return this.httpClient.post<void>(endpoints.logout)
  }
}
