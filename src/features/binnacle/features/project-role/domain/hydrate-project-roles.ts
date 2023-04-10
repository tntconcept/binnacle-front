import { singleton } from 'tsyringe'
import { SearchProjectRolesResult } from '../../search/domain/search-project-roles-result'
import { NonHydratedProjectRole } from './non-hydrated-project-role'
import { ProjectRole } from './project-role'

@singleton()
export class HydrateProjectRoles {
  hydrate(
    nonHydratedProjectRoles: NonHydratedProjectRole[],
    searchProjectRolesResult: SearchProjectRolesResult
  ): ProjectRole[] {
    const { organizations = [], projects = [] } = searchProjectRolesResult

    return nonHydratedProjectRoles.map((nonHydratedProjectRole) => {
      const organization = organizations.find((o) => o.id === nonHydratedProjectRole.organizationId)
      const project = projects.find((p) => p.id === nonHydratedProjectRole.projectId)

      return {
        ...nonHydratedProjectRole,
        organization,
        project
      } as ProjectRole
    })
  }
}
