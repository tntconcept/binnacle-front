import { Query, UseCaseKey } from '@archimedes/arch'
import { SUBCONTRACTED_ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { chrono } from '../../../../../shared/utils/chrono'
import { inject, singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { SubcontractedActivity } from '../domain/subcontracted-activity'
import type { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { SubcontractedActivitiesWithRoleInformation } from '../domain/services/subcontracted-activities-with-role-information'
import { GetSubcontractedActivitiesQueryParams } from '../domain/get-subcontracted-activities-query-params'

@UseCaseKey('GetSubcontractedActivitiesQry')
@singleton()
export class GetSubcontractedActivitiesQry extends Query<
  SubcontractedActivity[],
  GetSubcontractedActivitiesQueryParams
> {
  constructor(
    @inject(SUBCONTRACTED_ACTIVITY_REPOSITORY)
    private readonly subcontractedActivityRepository: SubcontractedActivityRepository,
    private readonly searchProjectRolesQry: SearchProjectRolesQry,
    private readonly subcontractedActivitiesWithRoleInformation: SubcontractedActivitiesWithRoleInformation
  ) {
    super()
  }

  async internalExecute(
    filters: GetSubcontractedActivitiesQueryParams
  ): Promise<SubcontractedActivity[]> {
    const activitiesResponse = await this.subcontractedActivityRepository.getAll(filters)
    const activitiesSorted = activitiesResponse.slice()
    activitiesSorted.sort((a, b) => (chrono(new Date(a.month)).isAfter(new Date(b.month)) ? 1 : -1))

    const projectRoleIds = activitiesSorted.map((a) => a.projectRoleId)
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))

    const projectRolesInformation = await this.searchProjectRolesQry.execute({
      ids: uniqueProjectRoleIds,
      year: chrono(filters.startDate).getDate().getFullYear()
    })

    return this.subcontractedActivitiesWithRoleInformation.addRoleInformationToActivities(
      activitiesSorted,
      projectRolesInformation
    )
  }
}
