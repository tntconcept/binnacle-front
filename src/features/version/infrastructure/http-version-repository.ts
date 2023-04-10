import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { VersionRepository } from '../domain/version-repository'

@singleton()
export class HttpVersionRepository implements VersionRepository {
  protected static versionPath = '/version'

  constructor(private httpClient: HttpClient) {}

  async getApiVersion(): Promise<string> {
    return this.httpClient.get<string>(HttpVersionRepository.versionPath)
  }
}
