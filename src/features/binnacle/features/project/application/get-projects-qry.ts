import { Query, UseCaseKey } from '@archimedes/arch'
import { PROJECT_REPOSITORY } from 'shared/di/container-tokens'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import { Project } from '../domain/project'
import type { ProjectRepository } from '../domain/project-repository'

@UseCaseKey('GetProjectsQry')
@singleton()
export class GetProjectsQry extends Query<Project[], Id> {
  constructor(@inject(PROJECT_REPOSITORY) private projectRepository: ProjectRepository) {
    super()
  }

  internalExecute(organizationId: Id): Promise<Project[]> {
    return this.projectRepository.getAll(organizationId)
  }
}
