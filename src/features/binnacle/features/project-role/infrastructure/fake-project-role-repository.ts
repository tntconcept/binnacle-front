import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { singleton } from 'tsyringe'
import { NonHydratedProjectRole } from '../domain/non-hydrated-project-role'
import { ProjectRoleRepository } from '../domain/project-role-repository'

@singleton()
export class FakeProjectRoleRepository implements ProjectRoleRepository {
  async getAll(): Promise<NonHydratedProjectRole[]> {
    return ProjectRoleMother.nonHydratedProjectRoles()
  }
  async getRecents(): Promise<NonHydratedProjectRole[]> {
    return ProjectRoleMother.nonHydratedProjectRoles()
  }
}
