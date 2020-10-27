import httpClient from 'core/services/HttpClient'
import { IRecentRole } from 'core/api/interfaces'
import { IProjectRole } from 'core/api/interfaces'
import endpoints from 'core/api/endpoints'

export async function fetchRolesByProject(projectId: number) {
  return await httpClient(`${endpoints.projects}/${projectId}/roles`).json<IProjectRole[]>()
}

export async function fetchRecentRoles() {
  return await httpClient.get(endpoints.recentProjectRoles).json<IRecentRole[]>()
}
