import { HttpClient } from '../../../../../shared/http/http-client'
import { singleton } from 'tsyringe'
import { Organization } from '../domain/organization'
import { OrganizationRepository } from '../domain/organization-repository'
import { OrganizationFilters } from '../domain/organization-filters'

@singleton()
export class HttpOrganizationRepository implements OrganizationRepository {
  protected static organizationPath = `/api/organizations`

  constructor(private httpClient: HttpClient) {}

  async getAll(organizationFilters?: OrganizationFilters): Promise<Organization[]> {
    return this.httpClient.get(HttpOrganizationRepository.organizationPath, {
      params: organizationFilters
    })
  }
}
