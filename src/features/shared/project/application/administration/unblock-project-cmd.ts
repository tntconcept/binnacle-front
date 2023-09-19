import { Command, Id, UseCaseKey } from '@archimedes/arch'
import { ADMINISTRATION_PROJECT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ProjectRepository } from '../../domain/project-repository'

@UseCaseKey('UnblockProjectCmd')
@singleton()
export class UnblockProjectCmd extends Command<Id> {
  constructor(
    @inject(ADMINISTRATION_PROJECT_REPOSITORY) private projectRepository: ProjectRepository
  ) {
    super()
  }

  internalExecute(projectId: Id): Promise<void> {
    return this.projectRepository.setUnblock(projectId)
  }
}
