import { Query, UseCaseKey } from '@archimedes/arch'
import { inject, singleton } from 'tsyringe'
import { PROJECT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { Project } from '../../domain/project'
import type { ProjectRepository } from '../../domain/project-repository'
import { OrganizationFilters } from '../../domain/organization-filters'

@UseCaseKey('GetProjectsQry')
@singleton()
export class GetProjectsQry extends Query<Project[], OrganizationFilters> {
  constructor(@inject(PROJECT_REPOSITORY) private projectRepository: ProjectRepository) {
    super()
  }

  internalExecute(organizationStatus?: OrganizationFilters): Promise<Project[]> {
    return this.projectRepository.getProjects(organizationStatus)
  }
}
