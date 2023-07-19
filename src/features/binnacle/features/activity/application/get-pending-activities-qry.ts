import { Query, UseCaseKey } from '@archimedes/arch'
import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { Activity } from '../domain/activity'
import type { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { ActivitiesWithUserName } from '../domain/services/activities-with-user-name'
import { ActivitiesWithApprovalUserName } from '../domain/services/activities-with-approval-user-name'

@UseCaseKey('GetPendingActivitiesQry')
@singleton()
export class GetPendingActivitiesQry extends Query<Activity[], number> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private searchProjectRolesQry: SearchProjectRolesQry,
    private getUsersListQry: GetUsersListQry,
    private activitiesWithRoleInformation: ActivitiesWithRoleInformation,
    private activitiesWithUserName: ActivitiesWithUserName,
    private activitiesWithApprovalUserName: ActivitiesWithApprovalUserName
  ) {
    super()
  }

  async internalExecute(year: number): Promise<Activity[]> {
    const activitiesResponse = await this.activityRepository.getPendingApproval()
    const projectRoleIds = activitiesResponse.map((a) => a.projectRoleId)
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))

    const [projectRolesInformation, usersList] = await Promise.all([
      this.searchProjectRolesQry.execute({ ids: uniqueProjectRoleIds, year: year }),
      this.getUsersListQry.execute()
    ])

    const activities = this.activitiesWithRoleInformation.addRoleInformationToActivities(
      activitiesResponse,
      projectRolesInformation
    )

    const withUserName = this.activitiesWithUserName.addUserNameToActivities(activities, usersList)

    return this.activitiesWithApprovalUserName.addUserNameToActivitiesApproval(
      withUserName,
      usersList
    )
  }
}
