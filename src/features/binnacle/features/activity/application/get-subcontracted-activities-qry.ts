import { Query, UseCaseKey } from '@archimedes/arch'
import { GetUserLoggedQry } from '../../../../shared/user/application/get-user-logged-qry'
import { SUBCONTRACTED_ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { chrono } from '../../../../../shared/utils/chrono'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { SubcontractedActivity } from '../domain/subcontracted-activity'
import type { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { SubcontractedActivitiesWithRoleInformation } from '../domain/services/subcontracted-activities-with-role-information'

@UseCaseKey('GetSubcontractedActivitiesQry')
@singleton()
export class GetSubcontractedActivitiesQry extends Query<SubcontractedActivity[], DateInterval> {
  constructor(
    @inject(SUBCONTRACTED_ACTIVITY_REPOSITORY)
    private readonly subcontractedActivityRepository: SubcontractedActivityRepository,
    private readonly searchProjectRolesQry: SearchProjectRolesQry,
    private readonly subcontractedActivitiesWithRoleInformation: SubcontractedActivitiesWithRoleInformation,
    private readonly getUserLoggedQry: GetUserLoggedQry
  ) {
    super()
  }

  async internalExecute(dateInterval: DateInterval): Promise<SubcontractedActivity[]> {
    const { id } = await this.getUserLoggedQry.execute()
    const activitiesResponse = await this.subcontractedActivityRepository.getAll(dateInterval, id)
    const activitiesSorted = activitiesResponse.slice()
    activitiesSorted.sort((a, b) => (chrono(new Date(a.month)).isAfter(new Date(b.month)) ? 1 : -1))

    const projectRoleIds = activitiesSorted.map((a) => a.projectRoleId)
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))
    const { start } = dateInterval

    const projectRolesInformation = await this.searchProjectRolesQry.execute({
      ids: uniqueProjectRoleIds,
      year: start.getFullYear()
    })

    return this.subcontractedActivitiesWithRoleInformation.addRoleInformationToActivities(
      activitiesSorted,
      projectRolesInformation
    )
  }
}
