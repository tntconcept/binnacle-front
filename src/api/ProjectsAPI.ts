import httpClient from "api/HttpClient"
import {IProject} from "api/interfaces/IProject"
import endpoints from "api/endpoints"

export const getProjectsByOrganization = async (organizationId: number) => {
  return await httpClient(
    `${endpoints.organizations}/${organizationId}/projects`
  ).json<IProject[]>();
};
