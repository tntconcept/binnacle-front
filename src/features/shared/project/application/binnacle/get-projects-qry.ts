import { Query, UseCaseKey } from '@archimedes/arch'
import { inject, singleton } from 'tsyringe'
import { PROJECT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { Project } from '../../domain/project'
import type { ProjectRepository } from '../../domain/project-repository'
import { ProjectOrganizationFilters } from '../../domain/project-organization-filters'

@UseCaseKey('GetProjectsQry')
@singleton()
export class GetProjectsQry extends Query<Project[], ProjectOrganizationFilters> {
  constructor(@inject(PROJECT_REPOSITORY) private projectRepository: ProjectRepository) {
    super()
  }

  internalExecute(organizationStatus?: ProjectOrganizationFilters): Promise<Project[]> {
    return this.projectRepository.getProjects(organizationStatus)
  }
}
