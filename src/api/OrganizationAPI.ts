import httpClient from "api/HttpClient"
import {IOrganization} from "api/interfaces/IOrganization"
import endpoints from "api/endpoints"

export const getOrganizations = async () =>
  await httpClient(endpoints.organizations).json<IOrganization[]>();
