import { LiteProjectRoleWithProjectId } from 'modules/binnacle/data-access/interfaces/lite-project-role-with-project-id.interface'
import { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import { TimeUnits } from 'shared/types/time-unit'
import { ProjectMother } from './project-mother'

export class ProjectRoleMother {
  static projectRoles(): ProjectRole[] {
    return [this.projectRoleInMinutes(), this.projectRoleInDays()]
  }

  static liteProjectRoles(): LiteProjectRoleWithProjectId[] {
    return [this.liteProjectRoleInDays(), this.liteProjectRoleInMinutes()]
  }

  static projectRoleInMinutes(): ProjectRole {
    return {
      id: 1,
      name: 'Project in minutes',
      timeUnit: TimeUnits.MINUTES,
      requireEvidence: false
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

  static projectRoleInDays(): ProjectRole {
    return {
      id: 2,
      name: 'Project in days',
      timeUnit: TimeUnits.DAY,
      requireEvidence: false
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
}
