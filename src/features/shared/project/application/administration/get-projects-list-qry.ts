import { InvalidateCache, Query, UseCaseKey } from '@archimedes/arch'
import { GetUsersListQry } from '../../../user/application/get-users-list-qry'
import { ADMINISTRATION_PROJECT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { Project } from '../../domain/project'
import { OrganizationFilters } from '../../domain/organization-filters'
import type { ProjectRepository } from '../../domain/project-repository'
import { ProjectsWithUserName } from '../../domain/services/projects-with-user-name'

@UseCaseKey('GetProjectsListQry')
@InvalidateCache
@singleton()
export class GetProjectsListQry extends Query<Project[], OrganizationFilters> {
  constructor(
    @inject(ADMINISTRATION_PROJECT_REPOSITORY) private projectRepository: ProjectRepository,
    private getUsersListQry: GetUsersListQry,
    private projectsWithUserName: ProjectsWithUserName
  ) {
    super()
  }

  async internalExecute(organizationStatus?: OrganizationFilters): Promise<Project[]> {
    if (organizationStatus) {
      const projects = await this.projectRepository.getProjects(organizationStatus)
      const usersList = await this.getUsersListQry.execute({
        ids: projects.map((project) => project.blockedByUser).filter((id) => id !== null) as Id[]
      })
      return this.projectsWithUserName.addUserNameToProjects(projects, usersList)
    }
    return []
  }
}
