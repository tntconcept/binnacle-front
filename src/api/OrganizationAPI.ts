import httpClient from 'services/HttpClient'
import { IOrganization } from 'api/interfaces/IOrganization'
import endpoints from 'api/endpoints'

export async function fetchOrganizations() {
  return await httpClient(endpoints.organizations).json<IOrganization[]>()
}
