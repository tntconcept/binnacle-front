import { singleton } from 'tsyringe'
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

  async blockProject(): Promise<void> {
    return
  }

  async setUnblock(): Promise<void> {
    return
  }
}
