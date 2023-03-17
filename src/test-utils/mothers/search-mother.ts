import { SearchRolesResponse } from 'modules/binnacle/data-access/interfaces/search-roles-response.interface'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'
import { ProjectRoleMother } from './project-role-mother'

export class SearchMother {
  static roles(): SearchRolesResponse {
    return {
      organizations: OrganizationMother.organizations(),
      projects: ProjectMother.liteProjects(),
      projectRoles: ProjectRoleMother.liteProjectRoles()
    }
  }
}
