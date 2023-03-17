import { ActivityDaySummary } from 'modules/binnacle/data-access/interfaces/activity-day-summary'
import { ActivityWithProjectRoleId } from 'modules/binnacle/data-access/interfaces/activity-with-project-role-id.interface'
import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import { ActivityWithProjectRoleIdDto } from 'modules/binnacle/data-access/repositories/dto/activity-with-project-role-id-dto'
import { TimeUnits } from 'shared/types/time-unit'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'
import { ProjectRoleMother } from './project-role-mother'
import { UserMother } from './user-mother'

export class ActivityMother {
  static activitiesWithProjectRoleId(): ActivityWithProjectRoleId[] {
    return [
      this.daysActivityWithEvidenceAcceptedWithProjectRoleId(),
      this.minutesBillableActivityWithProjectRoleId(),
      this.minutesBillableActivityWithProjectRoleId(),
      this.minutesNoBillableActivityWithProjectRoleId(),
      this.daysActivityWithoutEvidencePendingWithProjectRoleId()
    ]
  }

  static activities(): Activity[] {
    return [
      this.daysActivityWithEvidenceAccepted(),
      this.minutesBillableActivityWithoutEvidence(),
      this.minutesBillableActivityWithoutEvidence(),
      this.minutesNoBillableActivityWithoutEvidence(),
      this.daysActivityWithoutEvidencePending()
    ]
  }

  static minutesBillableActivityWithoutEvidence(): Activity {
    return {
      id: 1,
      description: 'Minutes activity',
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
    return this.activityToActivityWithProjectRoleId(this.minutesBillableActivityWithoutEvidence())
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

  static minutesNoBillableActivityWithoutEvidence(): Activity {
    return {
      ...this.minutesBillableActivityWithoutEvidence(),
      id: 2,
      billable: false
    }
  }

  static minutesNoBillableActivityWithProjectRoleId(): ActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.minutesNoBillableActivityWithoutEvidence())
  }

  static daysActivityWithEvidenceAccepted(): Activity {
    return {
      id: 3,
      description: 'Accepted activity in days',
      billable: false,
      hasEvidence: true,
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProject(),
      projectRole: ProjectRoleMother.liteProjectRoleInDays(),
      approvalState: 'ACCEPTED',
      userId: UserMother.user().id,
      interval: {
        start: new Date('2023-02-28T00:00:00.000Z'),
        end: new Date('2023-03-03T00:00:00.000Z'),
        duration: 4,
        timeUnit: TimeUnits.DAY
      }
    }
  }

  static daysActivityWithEvidenceAcceptedWithProjectRoleId(): ActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.daysActivityWithEvidenceAccepted())
  }

  static daysActivityWithoutEvidencePending(): Activity {
    return {
      id: 4,
      description: 'Pending activity in days',
      billable: false,
      hasEvidence: false,
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProject(),
      projectRole: ProjectRoleMother.liteProjectRoleInDays(),
      approvalState: 'PENDING',
      userId: UserMother.user().id,
      interval: {
        start: new Date('2023-03-23T00:00:00.000Z'),
        end: new Date('2023-03-30T00:00:00.000Z'),
        duration: 6,
        timeUnit: TimeUnits.DAY
      }
    }
  }

  static daysActivityWithoutEvidencePendingWithProjectRoleId(): ActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.daysActivityWithoutEvidencePending())
  }

  static recentRoles(): RecentRole[] {
    return [this.recentRoleInMinutes(), this.recentRoleInDays()]
  }

  static recentRoleInMinutes(): RecentRole {
    const { interval, project, projectRole, organization } =
      this.minutesNoBillableActivityWithoutEvidence()
    return {
      id: projectRole.id,
      name: projectRole.name,
      requireEvidence: false,
      projectName: project.name,
      projectBillable: false,
      organizationName: organization.name,
      date: interval.start.toISOString(),
      timeUnit: interval.timeUnit
    }
  }

  static recentRoleInDays(): RecentRole {
    const { interval, project, projectRole, organization } =
      this.daysActivityWithoutEvidencePending()
    return {
      id: projectRole.id,
      name: projectRole.name,
      requireEvidence: true,
      projectName: project.name,
      projectBillable: true,
      organizationName: organization.name,
      date: interval.start.toISOString(),
      timeUnit: interval.timeUnit
    }
  }

  static marchActivitySummary(): ActivityDaySummary[] {
    return [
      {
        date: new Date('2023-02-27'),
        worked: 0
      },
      {
        date: new Date('2023-02-28'),
        worked: 0
      },
      {
        date: new Date('2023-03-01'),
        worked: 0
      },
      {
        date: new Date('2023-03-02'),
        worked: 0
      },
      {
        date: new Date('2023-03-03'),
        worked: 0
      },
      {
        date: new Date('2023-03-04'),
        worked: 0
      },
      {
        date: new Date('2023-03-05'),
        worked: 0
      },
      {
        date: new Date('2023-03-06'),
        worked: 0
      },
      {
        date: new Date('2023-03-07'),
        worked: 0
      },
      {
        date: new Date('2023-03-08'),
        worked: 0
      },
      {
        date: new Date('2023-03-09'),
        worked: 0
      },
      {
        date: new Date('2023-03-10'),
        worked: 0
      },
      {
        date: new Date('2023-03-11'),
        worked: 0
      },
      {
        date: new Date('2023-03-12'),
        worked: 0
      },
      {
        date: new Date('2023-03-13'),
        worked: 4
      },
      {
        date: new Date('2023-03-14'),
        worked: 0
      },
      {
        date: new Date('2023-03-15'),
        worked: 0
      },
      {
        date: new Date('2023-03-16'),
        worked: 0
      },
      {
        date: new Date('2023-03-17'),
        worked: 0
      },
      {
        date: new Date('2023-03-18'),
        worked: 0
      },
      {
        date: new Date('2023-03-19'),
        worked: 0
      },
      {
        date: new Date('2023-03-20'),
        worked: 0
      },
      {
        date: new Date('2023-03-21'),
        worked: 0
      },
      {
        date: new Date('2023-03-22'),
        worked: 0
      },
      {
        date: new Date('2023-03-23'),
        worked: 0
      },
      {
        date: new Date('2023-03-24'),
        worked: 0
      },
      {
        date: new Date('2023-03-25'),
        worked: 0
      },
      {
        date: new Date('2023-03-26'),
        worked: 0
      },
      {
        date: new Date('2023-03-27'),
        worked: 0
      },
      {
        date: new Date('2023-03-28'),
        worked: 0
      },
      {
        date: new Date('2023-03-29'),
        worked: 0
      },
      {
        date: new Date('2023-03-30'),
        worked: 0
      },
      {
        date: new Date('2023-03-31'),
        worked: 0
      },
      {
        date: new Date('2023-04-01'),
        worked: 0
      },
      {
        date: new Date('2023-04-02'),
        worked: 0
      }
    ]
  }

  static activityToActivityWithProjectRoleId(activity: Activity): ActivityWithProjectRoleId {
    const { projectRole, ...rest } = activity

    return {
      ...rest,
      projectRoleId: projectRole.id
    }
  }
}
