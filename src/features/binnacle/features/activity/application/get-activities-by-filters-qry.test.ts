import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { SearchMother } from '../../../../../test-utils/mothers/search-mother'
import { UserMother } from '../../../../../test-utils/mothers/user-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { ActivitiesWithUserName } from '../domain/services/activities-with-user-name'
import { GetActivitiesByFiltersQry } from './get-activities-by-filters-qry'

describe('GetActivitiesByFiltersQry', () => {
  it('should return pending activities', async () => {
    const { getPendingActivitiesQry, activitiesUser } = setup()

    const result = await getPendingActivitiesQry.internalExecute({
      year: 2023,
      queryParams: {
        approvalState: 'PENDING'
      }
    })

    expect(result).toEqual(activitiesUser)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const getUsersListQry = mock<GetUsersListQry>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const activitiesWithRoleInformation = mock<ActivitiesWithRoleInformation>()
  const activitiesWithUserName = mock<ActivitiesWithUserName>()

  const activitiesResponse = ActivityMother.activitiesWithProjectRoleId()
  activityRepository.getActivitiesBasedOnFilters.mockResolvedValue(activitiesResponse)

  const userList = UserMother.userList()
  getUsersListQry.execute.mockResolvedValue(userList)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.mockResolvedValue(projectRolesInformation)

  const activities = ActivityMother.activitiesPending()
  activitiesWithRoleInformation.addRoleInformationToActivities
    .calledWith(activitiesResponse, projectRolesInformation)
    .mockReturnValue(activities)

  const activitiesUser = ActivityMother.activitiesPendingWithUserName()
  activitiesWithUserName.addUserNameToActivities
    .calledWith(activities, userList)
    .mockReturnValue(activitiesUser)

  return {
    getPendingActivitiesQry: new GetActivitiesByFiltersQry(
      activityRepository,
      searchProjectRolesQry,
      getUsersListQry,
      activitiesWithRoleInformation,
      activitiesWithUserName
    ),
    activityRepository,
    searchProjectRolesQry,
    activitiesWithRoleInformation,
    activities,
    activitiesUser
  }
}
