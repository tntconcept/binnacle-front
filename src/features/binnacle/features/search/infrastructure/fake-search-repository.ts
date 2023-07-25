import { SearchMother } from '../../../../../test-utils/mothers/search-mother'
import { SearchProjectRolesResult } from '../domain/search-project-roles-result'
import { SearchRepository } from '../domain/search-repository'

export class FakeSearchRepository implements SearchRepository {
  async searchProjectRoles(): Promise<SearchProjectRolesResult> {
    return SearchMother.roles()
  }
}
