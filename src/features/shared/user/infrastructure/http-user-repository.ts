import { HttpClient } from '../../../../shared/http/http-client'
import { singleton } from 'tsyringe'
import { AnonymousUserError } from '../domain/anonymous-user-error'
import { UserRepository } from '../domain/user-repository'
import { User } from '../domain/user'
import { UserInfo } from '../domain/user-info'

@singleton()
export class HttpUserRepository implements UserRepository {
  protected static userMePath = '/api/user/me'
  protected static usersPath = '/api/user'

  constructor(private httpClient: HttpClient) {}

  async getUser(): Promise<User> {
    try {
      return await this.httpClient.get<User>(HttpUserRepository.userMePath)
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401) {
        throw new AnonymousUserError()
      }

      throw error
    }
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
