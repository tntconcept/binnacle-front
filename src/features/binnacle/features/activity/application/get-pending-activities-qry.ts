import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import type { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { GetUsersListQry } from '../../../../user/application/get-users-list-qry'
import { ActivitiesWithUserName } from '../domain/services/activities-with-user-name'
import { Activity } from '../domain/activity'

@UseCaseKey('GetPendingActivitiesQry')
@singleton()
export class GetPendingActivitiesQry extends Query<Activity[]> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private searchProjectRolesQry: SearchProjectRolesQry,
    private getUsersListQry: GetUsersListQry,
    private activitiesWithRoleInformation: ActivitiesWithRoleInformation,
    private activitiesWithUserName: ActivitiesWithUserName
  ) {
    super()
  }

  async internalExecute(): Promise<Activity[]> {
    const activitiesResponse = await this.activityRepository.getPending()
    const projectRoleIds = activitiesResponse.map((a) => a.projectRoleId)
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))

    const projectRolesInformation = await this.searchProjectRolesQry.execute(uniqueProjectRoleIds)

    const usersList = await this.getUsersListQry.execute()

    const activities = this.activitiesWithRoleInformation.addRoleInformationToActivities(
      activitiesResponse,
      projectRolesInformation
    )

    return this.activitiesWithUserName.addUserNameToActivities(activities, usersList)
  }
}
