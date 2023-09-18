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
import { GetActivitiesQueryParams } from '../domain/get-activities-query-params'

interface GetActivitiesByStateParams {
  queryParams: GetActivitiesQueryParams
}

@UseCaseKey('GetActivitiesByFiltersQry')
@singleton()
export class GetActivitiesByFiltersQry extends Query<Activity[], GetActivitiesByStateParams> {
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

  async internalExecute({ queryParams }: GetActivitiesByStateParams): Promise<Activity[]> {
    const activitiesResponse = await this.activityRepository.getActivitiesBasedOnFilters(
      queryParams
    )
    const projectRoleIds = activitiesResponse.map((a) => a.projectRoleId)
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))
    const userIds = activitiesResponse.map((activity) => activity.userId)
    const uniqueUserIds = Array.from(new Set(userIds))

    const [projectRolesInformation, usersList] = await Promise.all([
      this.searchProjectRolesQry.execute({
        ids: uniqueProjectRoleIds,
        year: new Date(queryParams.startDate).getFullYear()
      }),
      this.getUsersListQry.execute({ ids: uniqueUserIds })
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
