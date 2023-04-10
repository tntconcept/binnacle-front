import { SearchProjectRolesResult } from 'features/binnacle/features/search/domain/search-project-roles-result'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'
import { ProjectRoleMother } from './project-role-mother'

export class SearchMother {
  static roles(): SearchProjectRolesResult {
    return {
      organizations: OrganizationMother.organizations(),
      projects: ProjectMother.liteProjectsWithOrganizationId(),
      projectRoles: ProjectRoleMother.liteProjectRoles()
    }
  }
}
