import {index} from "services/HttpClient"
import {FREQUENT_ROLES_ENDPOINT} from "services/endpoints"
import {IRecentRole} from "interfaces/IRecentRole"

export const getRecentRoles = async () => {
  return await index
    .get(FREQUENT_ROLES_ENDPOINT)
    .json<IRecentRole[]>();
};
