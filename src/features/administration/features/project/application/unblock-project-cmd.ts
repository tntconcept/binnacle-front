import { Command, Id, UseCaseKey } from '@archimedes/arch'
import { PROJECT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ProjectRepository } from '../../../../shared/project/domain/project-repository'

@UseCaseKey('UnblockProjectCmd')
@singleton()
export class UnblockProjectCmd extends Command<Id> {
  constructor(@inject(PROJECT_REPOSITORY) private projectRepository: ProjectRepository) {
    super()
  }

  internalExecute(projectId: Id): Promise<void> {
    return this.projectRepository.setUnblock(projectId)
  }
}
