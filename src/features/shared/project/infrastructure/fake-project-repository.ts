import { singleton } from 'tsyringe'
import { Project } from '../domain/project'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectMother } from '../../../../test-utils/mothers/project-mother'

@singleton()
export class FakeProjectRepository implements ProjectRepository {
  async getProjects(): Promise<Project[]> {
    return ProjectMother.projectsFilteredByOrganizationDateIsoWithName()
  }

  async blockProject(): Promise<void> {
    return
  }

  async setUnblock(): Promise<void> {
    return
  }
}
