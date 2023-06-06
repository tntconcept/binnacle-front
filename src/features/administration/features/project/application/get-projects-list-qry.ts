import { Query, UseCaseKey } from '@archimedes/arch'
import { ADMINISTRATION_PROJECT_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { ProjectRepository } from '../domain/project-repository'
import { Project } from '../domain/project'
import { OrganizationWithStatus } from '../domain/organization-status'

@UseCaseKey('GetProjectsListQry')
@singleton()
export class GetProjectsListQry extends Query<Project[], OrganizationWithStatus> {
  constructor(
    @inject(ADMINISTRATION_PROJECT_REPOSITORY) private projectRepository: ProjectRepository
  ) {
    super()
  }

  internalExecute(organizationStatus: OrganizationWithStatus): Promise<Project[]> {
    return this.projectRepository.getProjects(organizationStatus)
  }
}
