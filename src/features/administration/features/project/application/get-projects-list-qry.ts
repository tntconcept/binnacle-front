import { InvalidateCache, Query, UseCaseKey } from '@archimedes/arch'
import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { Project } from '../../../../shared/project/domain/project'
import { OrganizationFilters } from '../../../../shared/project/domain/organization-filters'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'
import { GetProjectsQry } from '../../../../shared/project/application/binnacle/get-projects-qry'

@UseCaseKey('GetProjectsListQry')
@InvalidateCache
@singleton()
export class GetProjectsListQry extends Query<Project[], OrganizationFilters> {
  constructor(
    private getProjectsQry: GetProjectsQry,
    private getUsersListQry: GetUsersListQry,
    private projectsWithUserName: ProjectsWithUserName
  ) {
    super()
  }

  async internalExecute(organizationStatus?: OrganizationFilters): Promise<Project[]> {
    if (organizationStatus) {
      const projects = await this.getProjectsQry.execute(organizationStatus)
      const usersList = await this.getUsersListQry.execute({
        ids: projects.map((project) => project.blockedByUser).filter((id) => id !== null) as Id[]
      })
      return this.projectsWithUserName.addProjectBlockerUserName(projects, usersList)
    }
    return []
  }
}
