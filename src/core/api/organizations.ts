import httpClient from 'core/services/HttpClient'
import { IOrganization } from 'core/api/interfaces'
import endpoints from 'core/api/endpoints'

export async function fetchOrganizations() {
  return await httpClient(endpoints.organizations).json<IOrganization[]>()
}
