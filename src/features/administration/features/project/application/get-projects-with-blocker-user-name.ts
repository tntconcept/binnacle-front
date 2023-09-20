import { InvalidateCache, Query, UseCaseKey } from '@archimedes/arch'
import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { Project } from '../../../../shared/project/domain/project'
import { ProjectOrganizationFilters } from '../../../../shared/project/domain/project-organization-filters'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'
import { GetProjectsQry } from '../../../../shared/project/application/binnacle/get-projects-qry'

@UseCaseKey('GetProjectsWithBlockerUserName')
@InvalidateCache
@singleton()
export class GetProjectsWithBlockerUserName extends Query<Project[], ProjectOrganizationFilters> {
  constructor(
    private getProjectsQry: GetProjectsQry,
    private getUsersListQry: GetUsersListQry,
    private projectsWithUserName: ProjectsWithUserName
  ) {
    super()
  }

  async internalExecute(organizationStatus?: ProjectOrganizationFilters): Promise<Project[]> {
    if (organizationStatus) {
      const projects = await this.getProjectsQry.execute(organizationStatus)

      const blockerUserIds = projects
        .map((project) => project.blockedByUser)
        .filter((id) => id !== null) as Id[]

      if (blockerUserIds.length > 0) {
        const uniqueBlockerUserIds = Array.from(new Set(blockerUserIds))
        const usersList = await this.getUsersListQry.execute({
          ids: uniqueBlockerUserIds
        })
        return this.projectsWithUserName.addProjectBlockerUserName(projects, usersList)
      }
      return projects
    }
    return []
  }
}
