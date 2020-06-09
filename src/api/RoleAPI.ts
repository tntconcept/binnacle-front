import httpClient from "services/HttpClient"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {IProjectRole} from "api/interfaces/IProjectRole"
import endpoints from "api/endpoints"

export const getRecentRoles = async () => {
  return await httpClient
    .get(endpoints.recentProjectRoles)
    .json<IRecentRole[]>();
};

export const getRolesByProject = async (projectId: number) =>
  await httpClient(`${endpoints.projects}/${projectId}/roles`).json<
    IProjectRole[]
  >();
