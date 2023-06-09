import { InvalidateCache, Query, UseCaseKey } from '@archimedes/arch'
import { GetUsersListQry } from 'features/shared/user/application/get-users-list-qry'
import { ADMINISTRATION_PROJECT_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { OrganizationWithStatus } from '../domain/organization-status'
import { Project } from '../domain/project'
import type { ProjectRepository } from '../domain/project-repository'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'

@UseCaseKey('GetProjectsListQry')
@InvalidateCache
@singleton()
export class GetProjectsListQry extends Query<Project[], OrganizationWithStatus> {
  constructor(
    @inject(ADMINISTRATION_PROJECT_REPOSITORY) private projectRepository: ProjectRepository,
    private getUsersListQry: GetUsersListQry,
    private projectsWithUserName: ProjectsWithUserName
  ) {
    super()
  }

  async internalExecute(organizationStatus?: OrganizationWithStatus): Promise<Project[]> {
    const projects = await this.projectRepository.getProjects(organizationStatus)
    const usersList = await this.getUsersListQry.execute()
    return this.projectsWithUserName.addUserNameToProjects(projects, usersList)
  }
}
