import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { OrganizationWithStatus } from '../domain/organization-status'
import { Project } from '../domain/project'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectMother } from '../domain/tests/project-mother'

@singleton()
export class FakeProjectRepository implements ProjectRepository {
  async getProjects(organizationWithStatus?: OrganizationWithStatus): Promise<Project[]> {
    if (organizationWithStatus) {
      return ProjectMother.projectsFilteredByOrganizationDateIsoWithName()
    }
    return []
  }

  async blockProject(projectId: Id, date: Date): Promise<void> {
    console.log(projectId, date)
    return
  }

  async setUnblock(projectId: Id): Promise<void> {
    console.log(projectId)
    return
  }
}
