import { ProjectMother } from '../../../../../test-utils/mothers/project-mother'
import { Project } from '../domain/project'
import { ProjectRepository } from '../domain/project-repository'

export class FakeProjectRepository implements ProjectRepository {
  async getAll(): Promise<Project[]> {
    return ProjectMother.projects()
  }
}
