import { Query, UseCaseKey } from '@archimedes/arch'
import { GetUserLoggedQry } from 'features/shared/user/application/get-user-logged-qry'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { DateInterval } from 'shared/types/date-interval'
import chrono from 'shared/utils/chrono'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { Activity } from '../domain/activity'
import type { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'

@UseCaseKey('GetActivitiesQry')
@singleton()
export class GetActivitiesQry extends Query<Activity[], DateInterval> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private searchProjectRolesQry: SearchProjectRolesQry,
    private activitiesWithRoleInformation: ActivitiesWithRoleInformation,
    private getUserLoggedQry: GetUserLoggedQry
  ) {
    super()
  }

  async internalExecute(dateInterval: DateInterval): Promise<Activity[]> {
    const { id } = await this.getUserLoggedQry.execute()
    const activitiesResponse = await this.activityRepository.getAll(dateInterval, id)
    const activitiesSorted = activitiesResponse.slice()
    activitiesSorted.sort((a, b) => (chrono(a.interval.start).isAfter(b.interval.start) ? 1 : -1))

    const projectRoleIds = activitiesSorted.map((a) => a.projectRoleId)
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))
    const { start } = dateInterval

    const projectRolesInformation = await this.searchProjectRolesQry.execute({
      ids: uniqueProjectRoleIds,
      year: start.getFullYear()
    })

    return this.activitiesWithRoleInformation.addRoleInformationToActivities(
      activitiesSorted,
      projectRolesInformation
    )
  }
}
