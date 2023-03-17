import { OrganizationMother } from 'test-utils/mothers/organization-mother'
import { ProjectMother } from 'test-utils/mothers/project-mother'
import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { CombosRepository } from '../interfaces/combos-repository'
import { Organization } from '../interfaces/organization.interface'
import { ProjectRole } from '../interfaces/project-role.interface'
import { Project } from '../interfaces/project.interface'

export class FakeCombosRepository implements CombosRepository {
  async getOrganizations(): Promise<Organization[]> {
    return [OrganizationMother.organization()]
  }

  async getProjects(organizationId: number): Promise<Project[]> {
    const liteProjectIds = ProjectMother.liteProjects()
      .filter((p) => p.organizationId === organizationId)
      .map((p) => p.id)

    const projects = ProjectMother.projects()

    return projects.filter((p) => liteProjectIds.includes(p.id))
  }

  async getProjectRoles(projectId: number): Promise<ProjectRole[]> {
    const liteProjectRoleIds = ProjectRoleMother.liteProjectRoles()
      .filter((p) => p.projectId === projectId)
      .map((p) => p.id)

    const projectRoles = ProjectRoleMother.projectRoles()

    return projectRoles.filter((p) => liteProjectRoleIds.includes(p.id))
  }
}
