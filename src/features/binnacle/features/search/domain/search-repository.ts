import { SearchProjectRolesResult } from './search-project-roles-result'
import { Id } from '../../../../../shared/types/id'

export interface SearchRepositoryParams {
  ids: Id[]
  year: number
}

export interface SearchRepository {
  searchProjectRoles({ ids, year }: SearchRepositoryParams): Promise<SearchProjectRolesResult>
}
