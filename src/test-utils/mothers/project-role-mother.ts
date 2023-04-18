import { NonHydratedProjectRole } from 'features/binnacle/features/project-role/domain/non-hydrated-project-role'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { LiteProjectRoleWithProjectId } from 'features/binnacle/features/search/domain/lite-project-role-with-project-id'
import { TimeUnits } from 'shared/types/time-unit'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'

export class ProjectRoleMother {
  static projectRoles(): ProjectRole[] {
    return [this.projectRoleInMinutes(), this.projectRoleInDays()]
  }

  static liteProjectRoles(): LiteProjectRoleWithProjectId[] {
    return [this.liteProjectRoleInDays(), this.liteProjectRoleInMinutes()]
  }

  static nonHydratedProjectRoles(): NonHydratedProjectRole[] {
    return [this.nonHydratedProjectRoleInMinutes(), this.nonHydratedProjectRoleInDays()]
  }

  static projectRoleInMinutes(): ProjectRole {
    return {
      id: 1,
      name: 'Project in minutes',
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProject(),
      userId: 1,
      timeUnit: TimeUnits.MINUTES,
      requireEvidence: 'NO',
      requireApproval: false
    }
  }

  static projectRoleInDays(): ProjectRole {
    return {
      id: 2,
      name: 'Project in days',
      organization: OrganizationMother.organization(),
      project: ProjectMother.notBillableLiteProject(),
      userId: 1,
      timeUnit: TimeUnits.DAYS,
      requireEvidence: 'NO',
      requireApproval: false
    }
  }

  static liteProjectRoleInDays(): LiteProjectRoleWithProjectId {
    const { id, name } = this.projectRoleInDays()

    return {
      id,
      name,
      projectId: ProjectMother.notBillableProject().id
    }
  }

  static liteProjectRoleInMinutes(): LiteProjectRoleWithProjectId {
    const { id, name } = this.projectRoleInMinutes()

    return {
      id,
      name,
      projectId: ProjectMother.billableProject().id
    }
  }

  static nonHydratedProjectRoleInMinutes(): NonHydratedProjectRole {
    const { organization, project, ...rest } = this.projectRoleInMinutes()
    return {
      ...rest,
      organizationId: organization.id,
      projectId: project.id
    }
  }

  static nonHydratedProjectRoleInDays(): NonHydratedProjectRole {
    const { organization, project, ...rest } = this.projectRoleInDays()
    return {
      ...rest,
      organizationId: organization.id,
      projectId: project.id
    }
  }
}
