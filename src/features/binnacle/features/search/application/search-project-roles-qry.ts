import { Query, UseCaseKey } from '@archimedes/arch'
import { SEARCH_REPOSITORY } from 'shared/di/container-tokens'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesResult } from '../domain/search-project-roles-result'
import type { SearchRepository } from '../domain/search-repository'

@UseCaseKey('SearchProjectRolesQry')
@singleton()
export class SearchProjectRolesQry extends Query<SearchProjectRolesResult, Id[]> {
  constructor(@inject(SEARCH_REPOSITORY) private searchRepository: SearchRepository) {
    super()
  }
  internalExecute(ids: Id[]): Promise<SearchProjectRolesResult> {
    return this.searchRepository.searchProjectRoles(ids)
  }
}
