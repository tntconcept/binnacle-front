import { Activity } from 'features/binnacle/features/activity/domain/activity'
import { ActivityDaySummary } from 'features/binnacle/features/activity/domain/activity-day-summary'
import { ActivityWithProjectRoleId } from 'features/binnacle/features/activity/domain/activity-with-project-role-id'
import { TimeSummary } from 'features/binnacle/features/activity/domain/time-summary'
import { ActivityWithProjectRoleIdDto } from 'features/binnacle/features/activity/infrastructure/activity-with-project-role-id-dto'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { TimeUnits } from 'shared/types/time-unit'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'
import { ProjectRoleMother } from './project-role-mother'

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
      project: ProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInMinutes(),
      approvalState: 'NA',
      userId: 1,
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
      project: ProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDays(),
      approvalState: 'ACCEPTED',
      userId: 1,
      interval: {
        start: new Date('2023-02-28T00:00:00.000Z'),
        end: new Date('2023-03-03T00:00:00.000Z'),
        duration: 4,
        timeUnit: TimeUnits.DAYS
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
      project: ProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDays(),
      approvalState: 'PENDING',
      userId: 1,
      interval: {
        start: new Date('2023-03-23T00:00:00.000Z'),
        end: new Date('2023-03-30T00:00:00.000Z'),
        duration: 6,
        timeUnit: TimeUnits.DAYS
      }
    }
  }

  static daysActivityWithoutEvidencePendingWithProjectRoleId(): ActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.daysActivityWithoutEvidencePending())
  }

  static recentRoles(): ProjectRole[] {
    return [this.recentRoleInMinutes(), this.recentRoleInDays()]
  }

  static recentRoleInMinutes(): ProjectRole {
    const { interval, projectRole, organization } = this.minutesNoBillableActivityWithoutEvidence()
    return {
      id: projectRole.id,
      name: projectRole.name,
      requireEvidence: 'NO',
      project: ProjectMother.notBillableLiteProject(),
      organization: organization,
      requireApproval: false,
      timeUnit: interval.timeUnit,
      userId: 1
    }
  }

  static recentRoleInDays(): ProjectRole {
    const { interval, projectRole, organization } = this.daysActivityWithoutEvidencePending()
    return {
      id: projectRole.id,
      name: projectRole.name,
      requireEvidence: 'WEEKLY',
      requireApproval: false,
      project: ProjectMother.billableLiteProject(),
      organization: organization,
      timeUnit: interval.timeUnit,
      userId: 1
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

  static timeSummary(): TimeSummary {
    return {
      year: {
        current: {
          worked: 0,
          target: 0,
          balance: 0,
          notRequestedVacations: 0
        }
      },
      months: [
        {
          workable: 160,
          worked: 62.5,
          recommended: 141.77,
          balance: -79.27,
          vacation: 16,
          roles: [
            { id: ProjectRoleMother.projectRoleInDays().id, hours: 37.43 },
            { id: ProjectRoleMother.projectRoleInMinutes().id, hours: 25.07 }
          ]
        },
        {
          workable: 160,
          worked: 0,
          recommended: 141.77,
          balance: -141.77,
          vacation: 0,
          roles: []
        },
        {
          workable: 160,
          worked: 0,
          recommended: 141.77,
          balance: -141.77,
          vacation: 0,
          roles: []
        },
        {
          workable: 144,
          worked: 0,
          recommended: 127.58,
          balance: -127.58,
          vacation: 40,
          roles: []
        },
        {
          workable: 160,
          worked: 30.18,
          recommended: 141.77,
          balance: -111.59,
          vacation: 0,
          roles: [{ id: 123, hours: 30.18 }]
        },
        {
          workable: 176,
          worked: 0,
          recommended: 155.93,
          balance: -155.93,
          vacation: 0,
          roles: []
        },
        {
          workable: 168,
          worked: 0,
          recommended: 148.85,
          balance: -148.85,
          vacation: 0,
          roles: []
        },
        {
          workable: 176,
          worked: 0,
          recommended: 155.93,
          balance: -155.93,
          vacation: 0,
          roles: []
        },
        {
          workable: 168,
          worked: 0,
          recommended: 148.85,
          balance: -148.85,
          vacation: 0,
          roles: []
        },
        {
          workable: 168,
          worked: 0,
          recommended: 148.85,
          balance: -148.85,
          vacation: 0,
          roles: []
        },
        {
          workable: 160,
          worked: 0,
          recommended: 141.77,
          balance: -141.77,
          vacation: 0,
          roles: []
        },
        {
          workable: 144,
          worked: 0,
          recommended: 127.58,
          balance: -127.58,
          vacation: 0,
          roles: []
        }
      ]
    }
  }
}
