import { GetUserLoggedQry } from '../../../../shared/user/application/get-user-logged-qry'
import { mock } from 'jest-mock-extended'
import { chrono } from '../../../../../shared/utils/chrono'
import { SubcontractedActivityMother } from '../../../../../test-utils/mothers/subcontracted-activity-mother'
import { SearchMother } from '../../../../../test-utils/mothers/search-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { SubcontractedActivitiesWithRoleInformation } from '../domain/services/subcontracted-activities-with-role-information'
import { GetSubcontractedActivitiesQry } from './get-subcontracted-activities-qry'
import { UserMother } from '../../../../../test-utils/mothers/user-mother'
import { GetSubcontractedActivitiesQueryParams } from '../domain/get-subcontracted-activities-query-params'

describe('GetSubcontractedActivitiesQry', () => {
  it('should return subcontracted activities sorted by the given interval', async () => {
    const { getSubcontractedActivitiesQry, params, subcontractedActivities } = setup()

    const result = await getSubcontractedActivitiesQry.internalExecute(params)

    expect(result).toEqual(subcontractedActivities)
  })
})

function setup() {
  const subcontractedActivityRepository = mock<SubcontractedActivityRepository>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const getUserLoggedQry = mock<GetUserLoggedQry>()

  const params: GetSubcontractedActivitiesQueryParams = {
    startDate: '2024-05-01',
    endDate: '2024-07-30',
    organizationId: 1
  }

  const user = UserMother.userWithoutRoles()
  getUserLoggedQry.execute.mockResolvedValue(user)

  const activitiesResponse = [
    SubcontractedActivityMother.minutesActivityWithProjectRoleIdA(),
    SubcontractedActivityMother.minutesBillableActivityWithProjectRoleId()
  ]
  subcontractedActivityRepository.getAll.calledWith(params).mockResolvedValue(activitiesResponse)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.mockResolvedValue(projectRolesInformation)

  const subcontractedActivities = SubcontractedActivityMother.subcontractedActivities()
  subcontractedActivities.sort((a, b) =>
    chrono(new Date(a.month)).isAfter(new Date(b.month)) ? 1 : -1
  )

  return {
    getSubcontractedActivitiesQry: new GetSubcontractedActivitiesQry(
      subcontractedActivityRepository,
      searchProjectRolesQry,
      new SubcontractedActivitiesWithRoleInformation()
    ),
    subcontractedActivityRepository,
    searchProjectRolesQry,
    params,
    subcontractedActivities
  }
}
