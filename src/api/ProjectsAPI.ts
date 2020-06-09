import httpClient from "services/HttpClient"
import {IProject} from "api/interfaces/IProject"
import endpoints from "api/endpoints"

export async function fetchProjectsByOrganization(organizationId: number) {
  return await httpClient(
    `${endpoints.organizations}/${organizationId}/projects`
  ).json<IProject[]>();
};
