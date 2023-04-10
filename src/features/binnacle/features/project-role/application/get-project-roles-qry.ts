import { Query, UseCaseKey } from '@archimedes/arch'
import { PROJECT_ROLE_REPOSITORY } from 'shared/di/container-tokens'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import { NonHydratedProjectRole } from '../domain/non-hydrated-project-role'
import type { ProjectRoleRepository } from '../domain/project-role-repository'

@UseCaseKey('GetProjectRolesQry')
@singleton()
export class GetProjectRolesQry extends Query<NonHydratedProjectRole[], Id> {
  constructor(
    @inject(PROJECT_ROLE_REPOSITORY) private projectRoleRepository: ProjectRoleRepository
  ) {
    super()
  }

  internalExecute(projectId: Id): Promise<NonHydratedProjectRole[]> {
    return this.projectRoleRepository.getAll(projectId)
  }
}
