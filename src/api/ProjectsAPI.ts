import httpClient from "api/HttpClient"
import {IProject} from "api/interfaces/IProject"
import endpoints from "api/endpoints"

export const getProjectsByOrganization = async (...params: any) => {
  return await httpClient(
    `${endpoints.organizations}/${params[1].organizationId}/projects`
  ).json<IProject[]>();

}
