import httpClient from "api/HttpClient"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {IProjectRole} from "api/interfaces/IProjectRole"
import endpoints from "api/endpoints"

export const getRecentRoles = async () => {
  return await httpClient
    .get(endpoints.recentProjectRoles)
    .json<IRecentRole[]>();
};

export const getRolesByProject = async (...params: any) =>
  await httpClient(`${endpoints.projects}/${params[1].projectId}/roles`).json<
    IProjectRole[]
    >();

