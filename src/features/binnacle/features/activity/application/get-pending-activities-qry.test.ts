import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { SearchMother } from '../../../../../test-utils/mothers/search-mother'
import { UserMother } from '../../../../../test-utils/mothers/user-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { ActivitiesWithUserName } from '../domain/services/activities-with-user-name'
import { GetPendingActivitiesQry } from './get-pending-activities-qry'
import { ActivitiesWithApprovalUserName } from '../domain/services/activities-with-approval-user-name'

describe('GetPendingActivitiesQry', () => {
  it('should return pending activities', async () => {
    const { getPendingActivitiesQry, activitiesUser } = setup()

    const result = await getPendingActivitiesQry.internalExecute(2023)

    expect(result).toEqual(activitiesUser)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const getUsersListQry = mock<GetUsersListQry>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const activitiesWithRoleInformation = mock<ActivitiesWithRoleInformation>()
  const activitiesWithUserName = mock<ActivitiesWithUserName>()
  const activitiesWithApprovalUserName = mock<ActivitiesWithApprovalUserName>()

  const activitiesResponse = ActivityMother.activitiesWithProjectRoleId()
  activityRepository.getPendingApproval.mockResolvedValue(activitiesResponse)

  const userList = UserMother.userList()
  getUsersListQry.execute.mockResolvedValue(userList)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.mockResolvedValue(projectRolesInformation)

  const activities = ActivityMother.activitiesPending()
  activitiesWithRoleInformation.addRoleInformationToActivities
    .calledWith(activitiesResponse, projectRolesInformation)
    .mockReturnValue(activities)

  const activitiesUser = ActivityMother.activitiesPendingWithUserNames()

  activitiesWithUserName.addUserNameToActivities
    .calledWith(activities, userList)
    .mockReturnValue(activitiesUser)

  activitiesWithApprovalUserName.addUserNameToActivitiesApproval
    .calledWith(activitiesUser, userList)
    .mockReturnValue(activitiesUser)

  return {
    getPendingActivitiesQry: new GetPendingActivitiesQry(
      activityRepository,
      searchProjectRolesQry,
      getUsersListQry,
      activitiesWithRoleInformation,
      activitiesWithUserName,
      activitiesWithApprovalUserName
    ),
    activityRepository,
    searchProjectRolesQry,
    activitiesWithRoleInformation,
    activities,
    activitiesUser
  }
}
