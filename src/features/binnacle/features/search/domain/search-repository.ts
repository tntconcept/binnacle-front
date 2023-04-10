import { Id } from 'shared/types/id'
import { SearchProjectRolesResult } from './search-project-roles-result'

export interface SearchRepository {
  searchProjectRoles(ids: Id[]): Promise<SearchProjectRolesResult>
}
