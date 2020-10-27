import httpClient from 'core/services/HttpClient'
import { IProject } from 'core/api/interfaces'
import endpoints from 'core/api/endpoints'

export async function fetchProjectsByOrganization(organizationId: number) {
  return await httpClient(`${endpoints.organizations}/${organizationId}/projects`).json<
    IProject[]
  >()
}
