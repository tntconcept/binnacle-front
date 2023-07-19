import { NonHydratedProjectRole } from '../../features/binnacle/features/project-role/domain/non-hydrated-project-role'
import { ProjectRole } from '../../features/binnacle/features/project-role/domain/project-role'
import { LiteProjectRoleWithProjectId } from '../../features/binnacle/features/search/domain/lite-project-role-with-project-id'
import { TimeUnits } from '../../shared/types/time-unit'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'

export class ProjectRoleMother {
  static projectRoles(): ProjectRole[] {
    return [
      this.projectRoleInMinutes(),
      this.projectRoleInDays(),
      this.projectRoleInDaysRequireApproval()
    ]
  }

  static liteProjectRoles(): LiteProjectRoleWithProjectId[] {
    return [
      this.liteProjectRoleInDays(),
      this.liteProjectRoleInMinutes(),
      this.liteProjectRoleInDaysRequireApproval()
    ]
  }

  static nonHydratedProjectRoles(): NonHydratedProjectRole[] {
    return [
      this.nonHydratedProjectRoleInMinutes(),
      this.nonHydratedProjectRoleInDays(),
      this.nonHydratedProjectRoleInDaysRequireApproval()
    ]
  }

  static projectRoleInMinutes(): ProjectRole {
    return {
      id: 1,
      name: 'Project in minutes',
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProject(),
      userId: 1,
      requireEvidence: 'NO',
      requireApproval: false,
      timeInfo: {
        timeUnit: TimeUnits.MINUTES,
        maxTimeAllowed: {
          byYear: 0,
          byActivity: 0
        },
        userRemainingTime: 0
      }
    }
  }

  static projectRoleInDays(): ProjectRole {
    return {
      id: 2,
      name: 'Project in days',
      organization: OrganizationMother.organization(),
      project: ProjectMother.notBillableLiteProject(),
      userId: 1,
      requireEvidence: 'NO',
      requireApproval: false,
      timeInfo: {
        timeUnit: TimeUnits.DAYS,
        maxTimeAllowed: {
          byYear: 0,
          byActivity: 0
        },
        userRemainingTime: 0
      }
    }
  }

  static projectRoleInDaysRequireApproval(): ProjectRole {
    return {
      id: 3,
      name: 'Project in days 2',
      organization: OrganizationMother.organization(),
      project: ProjectMother.notBillableLiteProject(),
      userId: 1,
      requireEvidence: 'NO',
      requireApproval: true,
      timeInfo: {
        timeUnit: TimeUnits.DAYS,
        maxTimeAllowed: {
          byYear: 0,
          byActivity: 0
        },
        userRemainingTime: 0
      }
    }
  }

  static liteProjectRoleInDays(): LiteProjectRoleWithProjectId {
    return {
      ...this.projectRoleInDays(),
      projectId: ProjectMother.notBillableProject().id
    }
  }

  static liteProjectRoleInDaysRequireApproval(): LiteProjectRoleWithProjectId {
    return {
      ...this.projectRoleInDaysRequireApproval(),
      projectId: ProjectMother.notBillableProject().id
    }
  }

  static liteProjectRoleInMinutes(): LiteProjectRoleWithProjectId {
    return {
      ...this.projectRoleInMinutes(),
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

  static nonHydratedProjectRoleInDaysRequireApproval(): NonHydratedProjectRole {
    const { organization, project, ...rest } = this.projectRoleInDaysRequireApproval()
    return {
      ...rest,
      organizationId: organization.id,
      projectId: project.id
    }
  }
}
