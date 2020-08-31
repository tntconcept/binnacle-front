import { IUser } from 'api/interfaces/IUser'
import httpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'

export default async function fetchLoggedUser() {
  return await httpClient(endpoints.user).json<IUser>()
}
