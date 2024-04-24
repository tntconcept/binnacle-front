import { SubcontractedActivity } from '../../features/binnacle/features/activity/domain/subcontracted-activity'
import { SubcontractedActivityWithProjectRoleId } from '../../features/binnacle/features/activity/domain/subcontracted-activity-with-project-role-id'
import { TimeSummary } from '../../features/binnacle/features/activity/domain/time-summary'
import { NewSubcontractedActivity } from '../../features/binnacle/features/activity/domain/new-subcontracted-activity'
import { UpdateSubcontractedActivity } from '../../features/binnacle/features/activity/domain/update-subcontracted-activity'
import {
  YearBalancePerMonth,
  YearBalanceRoles
} from '../../features/binnacle/features/activity/domain/year-balance'
import { OrganizationMother } from './organization-mother'
import { LiteProjectMother } from './lite-project-mother'
import { ProjectRoleMother } from './project-role-mother'
import { SubcontractedActivityWithProjectRoleIdDto } from '../../features/binnacle/features/activity/infrastructure/subcontracted-activity-with-project-role-id-dto'

export class SubcontractedActivityMother {
  static subcontractedActivitiesWithProjectRoleId(): SubcontractedActivityWithProjectRoleId[] {
    const activities = [
      this.activity({
        id: 1
      }),
      this.activity({
        id: 2
      }),
      this.activity({
        id: 3
      })
    ]

    return activities.map(this.activityToActivityWithProjectRoleId)
  }

  static activity(override?: Partial<SubcontractedActivity>): SubcontractedActivity {
    return {
      id: 1,
      description: 'Subcontracted activity',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDaysRequireApproval(),
      userId: 1,
      duration: 4000,
      month: '2024-06',
      ...override
    }
  }

  static subcontractedActivities(): SubcontractedActivity[] {
    return [
      this.minutesBillableActivityWithoutEvidence(),
      this.minutesBillableActivityWithoutEvidence()
    ]
  }

  static subcontractedActivitiesSerialized(): SubcontractedActivityWithProjectRoleId[] {
    return [this.serializedMinutesBillableActivityWithProjectRoleIdDto()]
  }

  //   static activitiesPending(): SubcontractedActivity[] {
  //     return [this.daysActivityWithoutEvidencePending()]
  //   }

  //   static activitiesPendingWithUserNames(): SubcontractedActivity[] {
  //     const activity = this.daysActivityWithoutEvidencePending()
  //     return [
  //       {
  //         ...activity,
  //         userName: 'John',
  //         approval: {
  //           ...activity.approval,
  //           approvedByUserName: 'John Doe'
  //         }
  //       }
  //     ]
  //   }

  //   static activitiesPendingSerialized(): SubcontractedActivityWithProjectRoleIdDto[] {
  //     return [
  //       this.serializedMinutesBillableActivityWithProjectRoleIdDto({
  //         approval: {
  //           state: 'PENDING',
  //           canBeApproved: true
  //         }
  //       })
  //     ]
  //   }

  static minutesBillableActivityWithoutEvidence(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivity {
    return {
      id: 1,
      description: 'Minutes activity',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInMinutes(),
      userId: 1,
      duration: 4000,
      month: '2024-06',
      ...override
    }
  }

  static minutesBillableActivityWithProjectRoleId(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(
      this.minutesBillableActivityWithoutEvidence(override)
    )
  }

  //   static activityWithRenderDays(override?: Partial<SubcontractedActivity>): ActivityWithRenderDays {
  //     return {
  //       ...this.minutesBillableActivityWithoutEvidence(),
  //       renderIndex: 1,
  //       renderDays: 1,
  //       ...override
  //     }
  //   }

  static serializedMinutesBillableActivityWithProjectRoleIdDto(
    override?: Partial<SubcontractedActivityWithProjectRoleIdDto>
  ): SubcontractedActivityWithProjectRoleIdDto {
    const { ...activity } = this.minutesBillableActivityWithProjectRoleId()
    return {
      ...activity,
      ...override
    }
  }

  //   static minutesNoBillableActivityWithoutEvidence(): SubcontractedActivity {
  //     return {
  //       ...this.minutesBillableActivityWithoutEvidence(),
  //       id: 2,
  //       billable: false
  //     }
  //   }

  //   static minutesNoBillableActivityWithProjectRoleId(): SubcontractedActivityWithProjectRoleId {
  //     return this.activityToActivityWithProjectRoleId(this.minutesNoBillableActivityWithoutEvidence())
  //   }

  //   static minutesBillableActivityWithoutEvidencePeriodBeforeHiring(): SubcontractedActivity {
  //     return {
  //       ...this.minutesBillableActivityWithoutEvidence(),
  //   interval: {
  //     start: new Date('2000-03-01T09:00:00.000Z'),
  //     end: new Date('2000-03-01T13:00:00.000Z'),
  //     duration: 240,
  //     timeUnit: TimeUnits.MINUTES
  //   }
  //     }
  //   }

  static activityWithProjectRoleId(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.activity(override))
  }

  static activitiesPending(): SubcontractedActivity[] {
    return [this.daysActivityWithoutEvidencePending()]
  }

  static daysActivityWithoutEvidencePending(): SubcontractedActivity {
    return {
      id: 4,
      description: 'Pending activity in days',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDaysRequireApproval(),
      userId: 1,
      duration: 4000,
      month: '2024-05'
    }
  }

  static daysSubcontractedActivity(): SubcontractedActivity {
    return {
      id: 4,
      description: 'Subcontracted activity',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.billableLiteProjectWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInDaysRequireApproval(),
      userId: 1,
      duration: 4000,
      month: '2024-07'
    }
  }

  static daysSubcontractedActivityWithProjectRoleId(): SubcontractedActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.daysSubcontractedActivity())
  }

  static activityToActivityWithProjectRoleId(
    activity: SubcontractedActivity
  ): SubcontractedActivityWithProjectRoleId {
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

  static newSubcontractedActivity(): NewSubcontractedActivity {
    return {
      description: 'any-description',
      projectRoleId: 1,
      duration: 4000,
      month: '2024-07'
    }
  }

  static updateSubcontractedActivity(): UpdateSubcontractedActivity {
    return {
      id: 1,
      description: 'any-description',
      projectRoleId: 1,
      duration: 5555,
      month: '2024-07'
    }
  }
}
