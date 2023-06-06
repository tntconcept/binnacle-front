import { Query, UseCaseKey } from '@archimedes/arch'
import { ADMINISTRATION_PROJECT_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ProjectRepository } from '../domain/project-repository'
import { ProjectWithDate } from '../domain/project-date'

@UseCaseKey('BlockProjectCmd')
@singleton()
export class BlockProjectCmd extends Query<void, ProjectWithDate> {
  constructor(
    @inject(ADMINISTRATION_PROJECT_REPOSITORY) private projectRepository: ProjectRepository
  ) {
    super()
  }

  internalExecute(projectWithDate: ProjectWithDate): Promise<void> {
    return this.projectRepository.setBlock(projectWithDate)
  }
}
