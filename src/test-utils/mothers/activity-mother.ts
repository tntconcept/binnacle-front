import { ActivityWithProjectRoleId } from 'modules/binnacle/data-access/interfaces/activity-with-project-role-id.interface'
import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { ActivityWithProjectRoleIdDto } from 'modules/binnacle/data-access/repositories/dto/activity-with-project-role-id-dto'
import { TimeUnits } from 'shared/types/time-unit'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'
import { ProjectRoleMother } from './project-role-mother'
import { UserMother } from './user-mother'

export class ActivityMother {
  static minutesBillableActivityWithoutEvidence(): Activity {
    return {
      id: 1,
      description: 'Test activity description',
      billable: true,
      hasEvidence: false,
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProject(),
      projectRole: ProjectRoleMother.liteProjectRoleInMinutes(),
      approvalState: 'NA',
      userId: UserMother.user().id,
      interval: {
        start: new Date('2023-03-01T09:00:00.000Z'),
        end: new Date('2023-03-01T13:00:00.000Z'),
        duration: 240,
        timeUnit: TimeUnits.MINUTES
      }
    }
  }

  static minutesBillableActivityWithProjectRoleId(): ActivityWithProjectRoleId {
    const { projectRole, ...activity } = this.minutesBillableActivityWithoutEvidence()

    return {
      ...activity,
      projectRoleId: projectRole.id
    }
  }

  static serializedMinutesBillableActivityWithProjectRoleIdDto(): ActivityWithProjectRoleIdDto {
    const { interval, ...activity } = this.minutesBillableActivityWithProjectRoleId()
    const { start, end, duration, timeUnit } = interval

    return {
      ...activity,
      interval: {
        timeUnit,
        duration,
        start: start.toISOString(),
        end: end.toISOString()
      }
    }
  }
}
