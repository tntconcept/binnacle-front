import { LiteOrganization } from './lite-organization'
import { LiteProjectRoleWithProjectId } from './lite-project-role-with-project-id'
import { LiteProjectWithOrganizationId } from './lite-project-with-organization-id'

export interface SearchProjectRolesResult {
  organizations: LiteOrganization[]
  projects: LiteProjectWithOrganizationId[]
  projectRoles: LiteProjectRoleWithProjectId[]
}
