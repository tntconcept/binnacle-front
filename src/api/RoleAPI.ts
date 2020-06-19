import httpClient from 'services/HttpClient'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import endpoints from 'api/endpoints'

export async function fetchRolesByProject(projectId: number) {
  return await httpClient(`${endpoints.projects}/${projectId}/roles`).json<
    IProjectRole[]
  >()
}

export async function fetchRecentRoles() {
  return await httpClient.get(endpoints.recentProjectRoles).json<IRecentRole[]>()
}
