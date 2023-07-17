import { Query, UseCaseKey } from '@archimedes/arch'
import { PROJECT_ROLE_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { NonHydratedProjectRole } from '../domain/non-hydrated-project-role'
import type { ProjectRoleRepository, ProjectsIdByYear } from '../domain/project-role-repository'

@UseCaseKey('GetProjectRolesQry')
@singleton()
export class GetProjectRolesQry extends Query<NonHydratedProjectRole[], ProjectsIdByYear> {
  constructor(
    @inject(PROJECT_ROLE_REPOSITORY) private projectRoleRepository: ProjectRoleRepository
  ) {
    super()
  }

  internalExecute({ projectId, year }: ProjectsIdByYear): Promise<NonHydratedProjectRole[]> {
    return this.projectRoleRepository.getAll({ projectId, year })
  }
}
