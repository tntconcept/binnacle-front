import { SubcontractedActivity } from '../../features/binnacle/features/activity/domain/subcontracted-activity'
import { SubcontractedActivityWithProjectRoleId } from '../../features/binnacle/features/activity/domain/subcontracted-activity-with-project-role-id'
// import { NewSubcontractedActivity } from '../../features/binnacle/features/activity/domain/new-subcontracted-activity'
// import { UpdateSubcontractedActivity } from '../../features/binnacle/features/activity/domain/update-subcontracted-activity'
import { OrganizationMother } from './organization-mother'
import { LiteProjectMother } from './lite-project-mother'
import { ProjectRoleMother } from './project-role-mother'
import { SubcontractedActivityWithProjectRoleIdDto } from '../../features/binnacle/features/activity/infrastructure/subcontracted-activity-with-project-role-id-dto'
import { NewSubcontractedActivity } from '../../features/binnacle/features/activity/domain/new-subcontracted-activity'
import { UpdateSubcontractedActivity } from '../../features/binnacle/features/activity/domain/update-subcontracted-activity'

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
    return [this.minutesBillableActivityA(), this.minutesBillableActivityWithoutEvidence()]
  }

  static subcontractedActivitiesSerialized(): SubcontractedActivityWithProjectRoleId[] {
    return [this.serializedMinutesBillableActivityWithProjectRoleIdDto()]
  }

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

  static minutesBillableActivityA(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivity {
    return {
      id: 1,
      description: 'Minutes activity',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.projectAWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInMinutesProjectA(),
      userId: 1,
      duration: 4000,
      month: '2024-06',
      ...override
    }
  }

  static minutesBillableActivityB(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivity {
    return {
      id: 1,
      description: 'Minutes activity',
      organization: OrganizationMother.organization(),
      project: LiteProjectMother.projectBWithOrganizationId(),
      projectRole: ProjectRoleMother.liteProjectRoleInMinutesProjectB(),
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

  static minutesActivityWithProjectRoleIdA(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.minutesBillableActivityA(override))
  }

  static minutesActivityWithProjectRoleIdB(
    override?: Partial<SubcontractedActivity>
  ): SubcontractedActivityWithProjectRoleId {
    return this.activityToActivityWithProjectRoleId(this.minutesBillableActivityB(override))
  }

  static serializedMinutesBillableActivityWithProjectRoleIdDto(
    override?: Partial<SubcontractedActivityWithProjectRoleIdDto>
  ): SubcontractedActivityWithProjectRoleIdDto {
    const { ...activity } = this.minutesBillableActivityWithProjectRoleId()
    return {
      ...activity,
      ...override
    }
  }

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

  static activityToActivityWithProjectRoleId(
    activity: SubcontractedActivity
  ): SubcontractedActivityWithProjectRoleId {
    const { projectRole, ...rest } = activity

    return {
      ...rest,
      projectRoleId: projectRole.id
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
