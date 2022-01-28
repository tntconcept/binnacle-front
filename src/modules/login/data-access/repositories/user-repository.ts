import endpoints from 'shared/api/endpoints'
import type { User } from 'shared/api/users/User'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { singleton } from 'tsyringe'

@singleton()
export class UserRepository {
  constructor(private httpClient: HttpClient) {}

  async getUser(): Promise<User> {
    return await this.httpClient.get<User>(endpoints.user)
  }
}
