import { Id, Query, UseCaseKey } from '@archimedes/arch'
import { ADMINISTRATION_PROJECT_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ProjectRepository } from '../domain/project-repository'

@UseCaseKey('UnblockProjectCmd')
@singleton()
export class UnblockProjectCmd extends Query<void, Id> {
  constructor(
    @inject(ADMINISTRATION_PROJECT_REPOSITORY) private projectRepository: ProjectRepository
  ) {
    super()
  }

  internalExecute(projectId: Id): Promise<void> {
    return this.projectRepository.setUnblock(projectId)
  }
}
