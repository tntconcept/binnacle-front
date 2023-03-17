import { Id } from 'shared/types/id'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'

export interface SearchRepository {
  roles(roleIds: Id[]): Promise<SearchRolesResponse>
}
