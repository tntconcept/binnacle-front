import { Query, UseCaseKey } from '@archimedes/arch'
import { ADMINISTRATION_PROJECT_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ProjectRepository } from '../domain/project-repository'
import { Project } from '../domain/project'
import { OrganizationWithStatus } from '../domain/organization-status'
import { GetUsersListQry } from '../../../../user/application/get-users-list-qry'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'

@UseCaseKey('GetProjectsListQry')
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
