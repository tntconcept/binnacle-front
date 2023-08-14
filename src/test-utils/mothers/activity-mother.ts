import { Activity } from '../../features/binnacle/features/activity/domain/activity'
import { ActivityDaySummary } from '../../features/binnacle/features/activity/domain/activity-day-summary'
import { ActivityWithProjectRoleId } from '../../features/binnacle/features/activity/domain/activity-with-project-role-id'
import { TimeSummary } from '../../features/binnacle/features/activity/domain/time-summary'
import { ActivityWithProjectRoleIdDto } from '../../features/binnacle/features/activity/infrastructure/activity-with-project-role-id-dto'
import { TimeUnits } from '../../shared/types/time-unit'
import { ActivityWithRenderDays } from '../../features/binnacle/features/activity/domain/activity-with-render-days'
import { NewActivity } from '../../features/binnacle/features/activity/domain/new-activity'
import { UpdateActivity } from '../../features/binnacle/features/activity/domain/update-activity'
import {
  YearBalancePerMonth,
  YearBalanceRoles
} from '../../features/binnacle/features/activity/domain/year-balance'
import { Serialized } from '../../shared/types/serialized'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from './project-mother'
import { ProjectRoleMother } from './project-role-mother'

export class ActivityMother {
  static activitiesWithProjectRoleId(): ActivityWithProjectRoleId[] {
    const activities = [
      this.activity({
        id: 1,
        approval: {
          canBeApproved: true,
          state: 'PENDING'
        }
      }),
      this.activity({
        id: 2,
        approval: {
          canBeApproved: false,
          state: 'PENDING'
        }
      }),
      this.activity({
        id: 3,
        approval: {
          state: 'ACCEPTED',
          canBeApproved: false,
          approvalDate: new Date('2023-02-28T00:00:00.000Z'),
          approvedByUserId: undefined
        }
      })
    ]

    return activities.map(this.activityToActivityWithProjectRoleId)
  }

  static activities(): Activity[] {
    return [
      this.minutesBillableActivityWithoutEvidence(),
      this.minutesBillableActivityWithoutEvidence(),
      this.minutesNoBillableActivityWithoutEvidence()
    ]
  }

  static activitiesPending(): Activity[] {
    return [this.daysActivityWithoutEvidencePending()]
  }

  static activitiesPendingWithUserNames(): Activity[] {
    const activity = this.daysActivityWithoutEvidencePending()
    return [
      {
        ...activity,
        userName: 'John',
        approval: {
          ...activity.approval,
          approvedByUserName: 'John Doe'
        }
      }
    ]
  }

  static activitiesPendingSerialized(): ActivityWithProjectRoleIdDto[] {
    return [
      this.serializedMinutesBillableActivityWithProjectRoleIdDto({
        approval: {
          state: 'PENDING',
          canBeApproved: true
        }
      })
    ]
  }

  static minutesBillableActivityWithoutEvidence(override?: Partial<Activity>): Activity {
    return {
      id: 1,
      description: 'Minutes activity',
      billable: true,
      evidences: [],
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInMinutes(),
      approval: {
        canBeApproved: true,
        state: 'NA'
      },
      userId: 1,
      interval: {
        start: new Date('2023-03-01T09:00:00.000Z'),
        end: new Date('2023-03-01T13:00:00.000Z'),
        duration: 240,
        timeUnit: TimeUnits.MINUTES
      },
      ...override
    }
  }

  static minutesBillableActivityWithProjectRoleId(
    override?: Partial<Activity>
  ): ActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(
      this.minutesBillableActivityWithoutEvidence(override)
    )
  }

  static activityWithRenderDays(override?: Partial<Activity>): ActivityWithRenderDays {
    return {
      ...this.minutesBillableActivityWithoutEvidence(),
      renderIndex: 1,
      renderDays: 1,
      ...override
    }
  }

  static serializedMinutesBillableActivityWithProjectRoleIdDto(
    override?: Partial<ActivityWithProjectRoleIdDto>
  ): ActivityWithProjectRoleIdDto {
    const { interval, ...activity } = this.minutesBillableActivityWithProjectRoleId()
    const { start, end, duration, timeUnit } = interval

    return {
      ...activity,
      interval: {
        timeUnit,
        duration,
        start: start.toISOString(),
        end: end.toISOString()
      },
      ...override
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

  static minutesBillableActivityWithoutEvidencePeriodBeforeHiring(): Activity {
    return {
      ...this.minutesBillableActivityWithoutEvidence(),
      interval: {
        start: new Date('2000-03-01T09:00:00.000Z'),
        end: new Date('2000-03-01T13:00:00.000Z'),
        duration: 240,
        timeUnit: TimeUnits.MINUTES
      }
    }
  }

  static activityWithProjectRoleId(override?: Partial<Activity>): ActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.activity(override))
  }

  static activity(override?: Partial<Activity>): Activity {
    return {
      id: 1,
      description: 'Accepted activity in days',
      billable: false,
      organization: OrganizationMother.organization(),
      evidences: [],
      project: ProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDaysRequireApproval(),
      approval: {
        canBeApproved: true,
        state: 'ACCEPTED',
        approvalDate: new Date('2023-02-28T00:00:00.000Z'),
        approvedByUserId: 1
      },
      userId: 1,
      interval: {
        start: new Date('2023-02-28T00:00:00.000Z'),
        end: new Date('2023-03-03T00:00:00.000Z'),
        duration: 4,
        timeUnit: TimeUnits.DAYS
      },
      ...override
    }
  }

  static daysActivityWithoutEvidencePending(): Activity {
    return {
      id: 4,
      description: 'Pending activity in days',
      evidences: [],
      billable: false,
      organization: OrganizationMother.organization(),
      project: ProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDaysRequireApproval(),
      approval: {
        canBeApproved: false,
        state: 'PENDING',
        approvalDate: new Date('2023-02-28T00:00:00.000Z'),
        approvedByUserName: 'John Doe'
      },
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

  static serializedMarchActivitySummary(): Serialized<ActivityDaySummary>[] {
    return [
      {
        date: '2023-02-27',
        worked: 0
      },
      {
        date: '2023-02-28',
        worked: 0
      },
      {
        date: '2023-03-01',
        worked: 0
      },
      {
        date: '2023-03-02',
        worked: 0
      },
      {
        date: '2023-03-03',
        worked: 0
      },
      {
        date: '2023-03-04',
        worked: 0
      },
      {
        date: '2023-03-05',
        worked: 0
      },
      {
        date: '2023-03-06',
        worked: 0
      },
      {
        date: '2023-03-07',
        worked: 0
      },
      {
        date: '2023-03-08',
        worked: 0
      },
      {
        date: '2023-03-09',
        worked: 0
      },
      {
        date: '2023-03-10',
        worked: 0
      },
      {
        date: '2023-03-11',
        worked: 0
      },
      {
        date: '2023-03-12',
        worked: 0
      },
      {
        date: '2023-03-13',
        worked: 4
      },
      {
        date: '2023-03-14',
        worked: 0
      },
      {
        date: '2023-03-15',
        worked: 0
      },
      {
        date: '2023-03-16',
        worked: 0
      },
      {
        date: '2023-03-17',
        worked: 0
      },
      {
        date: '2023-03-18',
        worked: 0
      },
      {
        date: '2023-03-19',
        worked: 0
      },
      {
        date: '2023-03-20',
        worked: 0
      },
      {
        date: '2023-03-21',
        worked: 0
      },
      {
        date: '2023-03-22',
        worked: 0
      },
      {
        date: '2023-03-23',
        worked: 0
      },
      {
        date: '2023-03-24',
        worked: 0
      },
      {
        date: '2023-03-25',
        worked: 0
      },
      {
        date: '2023-03-26',
        worked: 0
      },
      {
        date: '2023-03-27',
        worked: 0
      },
      {
        date: '2023-03-28',
        worked: 0
      },
      {
        date: '2023-03-29',
        worked: 0
      },
      {
        date: '2023-03-30',
        worked: 0
      },
      {
        date: '2023-03-31',
        worked: 0
      },
      {
        date: '2023-04-01',
        worked: 0
      },
      {
        date: '2023-04-02',
        worked: 0
      }
    ]
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
          vacations: {
            enjoyed: 16,
            charged: 16
          },
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
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 160,
          worked: 0,
          recommended: 141.77,
          balance: -141.77,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 144,
          worked: 0,
          recommended: 127.58,
          balance: -127.58,
          vacations: {
            enjoyed: 40,
            charged: 40
          },
          roles: []
        },
        {
          workable: 160,
          worked: 30.18,
          recommended: 141.77,
          balance: -111.59,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: [{ id: 123, hours: 30.18 }]
        },
        {
          workable: 176,
          worked: 0,
          recommended: 155.93,
          balance: -155.93,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 168,
          worked: 0,
          recommended: 148.85,
          balance: -148.85,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 176,
          worked: 0,
          recommended: 155.93,
          balance: -155.93,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 168,
          worked: 0,
          recommended: 148.85,
          balance: -148.85,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 168,
          worked: 0,
          recommended: 148.85,
          balance: -148.85,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 160,
          worked: 0,
          recommended: 141.77,
          balance: -141.77,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        },
        {
          workable: 144,
          worked: 0,
          recommended: 127.58,
          balance: -127.58,
          vacations: {
            enjoyed: 0,
            charged: 0
          },
          roles: []
        }
      ]
    }
  }

  static emptyTimeSummary(): TimeSummary {
    return {
      year: {
        current: {
          worked: 0,
          target: 0,
          balance: 0,
          notRequestedVacations: 0
        }
      },
      months: new Array(12).fill({
        workable: 0,
        worked: 0,
        recommended: 0,
        balance: 0,
        vacations: 0,
        roles: []
      })
    }
  }

  static yearBalanceRole(): YearBalanceRoles {
    return {
      roleId: Math.floor(Math.random() * 500),
      organization: OrganizationMother.organization().name,
      project: 'Test Project Name',
      role: 'Test Project Role Name',
      worked: 0,
      months: new Array(12).fill(0)
    }
  }

  static yearBalanceMonth(): YearBalancePerMonth {
    return {
      recommended: 0,
      worked: 0,
      balance: 0,
      vacations: {
        hours: 0,
        percentage: 0
      },
      total: 0
    }
  }

  static newActivity(): NewActivity {
    return {
      description: 'any-description',
      billable: true,
      interval: {
        start: new Date('2000-03-01T09:00:00.000Z'),
        end: new Date('2000-03-01T13:00:00.000Z')
      },
      projectRoleId: 1
    }
  }

  static updateActivity(): UpdateActivity {
    return {
      id: 1,
      description: 'any-description',
      billable: true,
      interval: {
        start: new Date('2000-03-01T09:00:00.000Z'),
        end: new Date('2000-03-01T13:00:00.000Z')
      },
      projectRoleId: 1
    }
  }
}
