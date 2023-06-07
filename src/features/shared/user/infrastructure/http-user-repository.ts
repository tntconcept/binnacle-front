import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { AnonymousUserError } from '../domain/anonymous-user-error'
import { User } from '../domain/user'
import { SharedUserRepository } from '../domain/user-repository'

@singleton()
export class HttpSharedUserRepository implements SharedUserRepository {
  protected static userMePath = '/api/user/me'

  constructor(private httpClient: HttpClient) {}

  async getUser(): Promise<User> {
    try {
      return await this.httpClient.get<User>(HttpSharedUserRepository.userMePath)
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        throw new AnonymousUserError()
      }

      throw error
    }
  }
}
