import { HttpClient } from 'shared/http/http-client'
import { Organization } from '../domain/organization'
import { OrganizationRepository } from '../domain/organization-repository'

export class HttpOrganizationRepository implements OrganizationRepository {
  protected static organizationPath = `/organization`

  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Organization[]> {
    return this.httpClient.get(HttpOrganizationRepository.organizationPath)
  }
}
