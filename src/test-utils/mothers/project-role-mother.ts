import { NonHydratedProjectRole } from '../../features/binnacle/features/project-role/domain/non-hydrated-project-role'
import { ProjectRole } from '../../features/binnacle/features/project-role/domain/project-role'
import { LiteProjectRoleWithProjectId } from '../../features/binnacle/features/search/domain/lite-project-role-with-project-id'
import { TimeUnits } from '../../shared/types/time-unit'
import { OrganizationMother } from './organization-mother'
import { LiteProjectMother } from './lite-project-mother'
import { ProjectMother } from './project-mother'

export class ProjectRoleMother {
  static projectRoles(): ProjectRole[] {
    return [
      this.projectRoleInMinutes(),
      this.projectRoleInDays(),
      this.projectRoleInDaysRequireApproval(),
      this.projectRoleInMinutesProjectB(),
      this.projectRoleInMinutesProjectA()
    ]
  }

  static liteProjectRoles(): LiteProjectRoleWithProjectId[] {
    return [
      this.liteProjectRoleInDays(),
      this.liteProjectRoleInMinutes(),
      this.liteProjectRoleInDaysRequireApproval(),
      this.liteProjectRoleInMinutesProjectA(),
      this.liteProjectRoleInMinutesProjectB()
    ]
  }

  static nonHydratedProjectRoles(): NonHydratedProjectRole[] {
    return [
      this.nonHydratedProjectRoleInMinutes(),
      this.nonHydratedProjectRoleInDays(),
      this.nonHydratedProjectRoleInDaysRequireApproval(),
      this.nonHydratedProjectRoleInMinutes2(),
      this.nonHydratedProjectRoleInMinutes3()
    ]
  }

  static projectRoleInMinutes(): ProjectRole {
    return {
      id: 1,
      name: 'Project in minutes',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.billableLiteProject(),
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
      project: LiteProjectMother.notBillableLiteProject(),
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
      project: LiteProjectMother.notBillableLiteProject(),
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

  static projectRoleInMinutesProjectB(): ProjectRole {
    return {
      id: 4,
      name: 'Project in minutes 2',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.projectBWithOrganizationId(),
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

  static projectRoleInMinutesProjectA(): ProjectRole {
    return {
      id: 5,
      name: 'Project in minutes 3',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.projectAWithOrganizationId(),
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

  static liteProjectRoleInMinutesProjectB(): LiteProjectRoleWithProjectId {
    return {
      ...this.projectRoleInMinutesProjectB(),
      projectId: ProjectMother.projectB().id
    }
  }

  static liteProjectRoleInMinutesProjectA(): LiteProjectRoleWithProjectId {
    return {
      ...this.projectRoleInMinutesProjectA(),
      projectId: ProjectMother.projectA().id
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

  static nonHydratedProjectRoleInMinutes2(): NonHydratedProjectRole {
    const { organization, project, ...rest } = this.projectRoleInMinutesProjectB()
    return {
      ...rest,
      organizationId: organization.id,
      projectId: project.id
    }
  }

  static nonHydratedProjectRoleInMinutes3(): NonHydratedProjectRole {
    const { organization, project, ...rest } = this.projectRoleInMinutesProjectA()
    return {
      ...rest,
      organizationId: organization.id,
      projectId: project.id
    }
  }
}
