import { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import { LiteProjectRoleWithProjectId } from './lite-project-role-with-project-id.interface'
import { LiteProjectWithOrganizationId } from './lite-project-with-organization-id'

export interface SearchRolesResponse {
  organizations: Organization[]
  projects: LiteProjectWithOrganizationId[]
  projectRoles: LiteProjectRoleWithProjectId[]
}
