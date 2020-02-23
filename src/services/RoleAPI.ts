import {fetchClient} from "services/FetchClient"
import {FREQUENT_ROLES_ENDPOINT} from "services/endpoints"
import {IRecentRole} from "interfaces/IRecentRole"

export const getRecentRoles = async () => {
  return await fetchClient
    .get(FREQUENT_ROLES_ENDPOINT)
    .json<IRecentRole[]>();
};
