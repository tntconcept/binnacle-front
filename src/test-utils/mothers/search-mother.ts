import { SearchProjectRolesResult } from '../../features/binnacle/features/search/domain/search-project-roles-result'
import { OrganizationMother } from './organization-mother'
import { LiteProjectMother } from './lite-project-mother'
import { ProjectRoleMother } from './project-role-mother'

export class SearchMother {
  static roles(): SearchProjectRolesResult {
    return {
      organizations: OrganizationMother.organizations(),
      projects: LiteProjectMother.liteProjectsWithOrganizationId(),
      projectRoles: ProjectRoleMother.liteProjectRoles()
    }
  }

  static customRoles(override?: Partial<SearchProjectRolesResult>): SearchProjectRolesResult {
    return {
      organizations: OrganizationMother.organizations(),
      projects: LiteProjectMother.liteProjectsWithOrganizationId(),
      projectRoles: ProjectRoleMother.liteProjectRoles(),
      ...override
    }
  }

  static emptyRoles(): SearchProjectRolesResult {
    return {
      organizations: [],
      projects: [],
      projectRoles: []
    }
  }
}
