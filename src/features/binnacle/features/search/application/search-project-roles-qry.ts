import { Query, UseCaseKey } from '@archimedes/arch'
import { SEARCH_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesResult } from '../domain/search-project-roles-result'
import type { SearchRepository, SearchRepositoryParams } from '../domain/search-repository'

@UseCaseKey('SearchProjectRolesQry')
@singleton()
export class SearchProjectRolesQry extends Query<SearchProjectRolesResult, SearchRepositoryParams> {
  constructor(@inject(SEARCH_REPOSITORY) private searchRepository: SearchRepository) {
    super()
  }

  internalExecute({ ids, year }: SearchRepositoryParams): Promise<SearchProjectRolesResult> {
    return this.searchRepository.searchProjectRoles({ ids, year })
  }
}
