import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'

export interface SearchRepository {
  roles(roleIds: number[]): Promise<SearchRolesResponse>
}
