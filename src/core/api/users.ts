import httpClient from 'core/services/HttpClient'
import endpoints from 'core/api/endpoints'
import { IUser } from 'core/api/interfaces'

export default async function fetchLoggedUser() {
  return await httpClient(endpoints.user).json<IUser>()
}
