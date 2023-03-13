import { HttpClient } from '../../../../shared/data-access/http-client/http-client'
import { singleton } from 'tsyringe'
import endpoints from '../../../../shared/api/endpoints'
import { ApiVersionRepository } from '../interfaces/api-version-repository'

@singleton()
export class HttpApiVersionRepository implements ApiVersionRepository {
  constructor(private httpClient: HttpClient) {}

  async getApiVersion(): Promise<string> {
    return this.httpClient.get<string>(endpoints.version)
  }
}
