import { SearchMother } from 'test-utils/mothers/search-mother'
import { SearchRepository } from '../interfaces/search-repository'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'

export class FakeSearchRepository implements SearchRepository {
  async roles(): Promise<SearchRolesResponse> {
    return SearchMother.roles()
  }
}
