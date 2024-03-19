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

  async login({ username, password }: UserCredentials): Promise<void> {
    await fetch(`http://localhost:8080/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      redirect: 'error',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }).catch(console.log)
    return
    // return this.httpClient.post(
    //   HttpAuthRepository.loginPath,
    //   {
    //     username,
    //     password
    //   },
    //   { withCredentials: false }
    // )
  }
}
