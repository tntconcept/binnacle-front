import { singleton } from 'tsyringe'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import endpoints from 'shared/api/endpoints'
import { OAuth } from 'shared/types/OAuth'

@singleton()
export class OAuthRepository {
  private clientName: string = process.env.REACT_APP_CLIENT_NAME!
  private clientSecret: string = process.env.REACT_APP_CLIENT_SECRET!
  private base64Credentials = btoa(this.clientName + ':' + this.clientSecret)

  constructor(private httpClient: HttpClient) {}

  async getOAuthByUserCredentials(username: string, password: string): Promise<OAuth> {
    const searchParams = new URLSearchParams()
    searchParams.set('grant_type', 'password')
    searchParams.set('username', username)
    searchParams.set('password', password)

    return await this.httpClient.post<OAuth>(endpoints.auth, searchParams, {
      headers: {
        Authorization: `Basic ${this.base64Credentials}`
      }
    })
  }

  async renewOAuthByRefreshToken(refresh_token: string): Promise<OAuth> {
    return await this.httpClient.post<OAuth>(endpoints.auth, null, {
      headers: {
        Authorization: `Basic ${this.base64Credentials}`
      },
      params: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }
    })
  }
}
