import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { ProjectRepository } from '../domain/project-repository'
import { Project } from '../domain/project'
import { ProjectMother } from '../domain/tests/project-mother'
import { OrganizationWithStatus } from '../domain/organization-status'
import { ProjectWithDate } from '../domain/project-date'

@singleton()
export class FakeProjectRepository implements ProjectRepository {
  async getProjects(organizationWithStatus?: OrganizationWithStatus): Promise<Project[]> {
    if (organizationWithStatus) {
      return ProjectMother.projectsFilteredByOrganizationDateIsoWithName()
    }
    return []
  }

  async setBlock({ projectId, date }: ProjectWithDate): Promise<void> {
    console.log(projectId, date)
    return
  }

  async setUnblock(projectId: Id): Promise<void> {
    console.log(projectId)
    return
  }
}
