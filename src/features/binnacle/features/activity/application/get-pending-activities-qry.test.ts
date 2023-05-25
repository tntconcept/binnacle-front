import { anyArray, mock } from 'jest-mock-extended'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { GetPendingActivitiesQry } from './get-pending-activities-qry'

describe('GetPendingActivitiesQry', () => {
  it('should return pending activities', async () => {
    const { getPendingActivitiesQry, activities } = setup()

    const result = await getPendingActivitiesQry.internalExecute()

    expect(result).toEqual(activities)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const activitiesWithRoleInformation = mock<ActivitiesWithRoleInformation>()

  const activitiesResponse = ActivityMother.activitiesWithProjectRoleId()
  activityRepository.getPending.mockResolvedValue(activitiesResponse)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.calledWith(anyArray()).mockResolvedValue(projectRolesInformation)

  const activities = ActivityMother.activitiesPending()
  activitiesWithRoleInformation.addRoleInformationToActivities
    .calledWith(activitiesResponse, projectRolesInformation)
    .mockReturnValue(activities)

  return {
    getPendingActivitiesQry: new GetPendingActivitiesQry(
      activityRepository,
      searchProjectRolesQry,
      activitiesWithRoleInformation
    ),
    activityRepository,
    searchProjectRolesQry,
    activitiesWithRoleInformation,
    activities
  }
}
