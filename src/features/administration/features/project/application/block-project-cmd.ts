import { Command, UseCaseKey } from '@archimedes/arch'
import { PROJECT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { Id } from '../../../../../shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { ProjectRepository } from '../../../../shared/project/domain/project-repository'

@UseCaseKey('BlockProjectCmd')
@singleton()
export class BlockProjectCmd extends Command<{ projectId: Id; date: Date }> {
  constructor(@inject(PROJECT_REPOSITORY) private projectRepository: ProjectRepository) {
    super()
  }

  internalExecute({ projectId, date }: { projectId: Id; date: Date }): Promise<void> {
    return this.projectRepository.blockProject(projectId, date)
  }
}
