import {fetchClient} from "services/FetchClient"
import {FREQUENT_ROLES_ENDPOINT} from "services/endpoints"
import {IRecentRole} from "interfaces/IRecentRole"

export const getRecentRoles = async () => {
  return await fetchClient
    .url(FREQUENT_ROLES_ENDPOINT)
    .get()
    .json<IRecentRole[]>()
}