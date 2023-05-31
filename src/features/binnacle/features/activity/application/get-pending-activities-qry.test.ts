import { anyArray, mock } from 'jest-mock-extended'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { GetPendingActivitiesQry } from './get-pending-activities-qry'
import { ActivitiesWithUserName } from '../domain/services/activities-with-user-name'
import { GetUsersListQry } from '../../../../user/application/get-users-list-qry'
import { UserMother } from '../../../../../test-utils/mothers/user-mother'

describe('GetPendingActivitiesQry', () => {
  it('should return pending activities', async () => {
    const { getPendingActivitiesQry, activitiesUser } = setup()

    const result = await getPendingActivitiesQry.internalExecute()

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
  activityRepository.getPending.mockResolvedValue(activitiesResponse)

  const userList = UserMother.userList()
  getUsersListQry.execute.mockResolvedValue(userList)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.calledWith(anyArray()).mockResolvedValue(projectRolesInformation)

  const activities = ActivityMother.activitiesPending()
  activitiesWithRoleInformation.addRoleInformationToActivities
    .calledWith(activitiesResponse, projectRolesInformation)
    .mockReturnValue(activities)

  const activitiesUser = ActivityMother.activitiesPendingWithUserName()
  activitiesWithUserName.addUserNameToActivities
    .calledWith(activities, userList)
    .mockReturnValue(activitiesUser)

  return {
    getPendingActivitiesQry: new GetPendingActivitiesQry(
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
