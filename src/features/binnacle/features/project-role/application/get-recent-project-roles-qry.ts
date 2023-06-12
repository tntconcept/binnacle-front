import { Query, UseCaseKey } from '@archimedes/arch'
import { PROJECT_ROLE_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { HydrateProjectRoles } from '../domain/hydrate-project-roles'
import { ProjectRole } from '../domain/project-role'
import type { ProjectRoleRepository } from '../domain/project-role-repository'

@UseCaseKey('GetRecentProjectRolesQry')
@singleton()
export class GetRecentProjectRolesQry extends Query<ProjectRole[], number> {
  constructor(
    @inject(PROJECT_ROLE_REPOSITORY) private projectRoleRepository: ProjectRoleRepository,
    private searchProjectRolesQry: SearchProjectRolesQry,
    private hydrateProjectRoles: HydrateProjectRoles
  ) {
    super()
  }

  async internalExecute(year: number): Promise<ProjectRole[]> {
    const nonHydratedProjectRoles = await this.projectRoleRepository.getRecents(year)
    const projectRoleIds = nonHydratedProjectRoles.map((h) => h.id)
    const searchResult = await this.searchProjectRolesQry.execute(projectRoleIds)

    return this.hydrateProjectRoles.hydrate(nonHydratedProjectRoles, searchResult)
  }
}
