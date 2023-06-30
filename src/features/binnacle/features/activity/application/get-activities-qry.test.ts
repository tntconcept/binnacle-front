import { GetUserLoggedQry } from 'features/shared/user/application/get-user-logged-qry'
import { User } from 'features/shared/user/domain/user'
import { mock } from 'jest-mock-extended'
import { chrono } from 'shared/utils/chrono'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { SharedUserMother } from 'test-utils/mothers/shared-user-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { GetActivitiesQry } from './get-activities-qry'

describe('GetActivitiesQry', () => {
  it('should return activities sorted by the given interval', async () => {
    const { getActivitiesQry, interval, activities } = setup()

    const result = await getActivitiesQry.internalExecute(interval)

    expect(result).toEqual(activities)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const getUserLoggedQry = mock<GetUserLoggedQry>()

  const interval = {
    start: new Date('2023-02-01T09:00:00.000Z'),
    end: new Date('2023-03-03T13:00:00.000Z')
  }

  const user: User = SharedUserMother.user()
  getUserLoggedQry.execute.mockResolvedValue(user)

  const activitiesResponse = ActivityMother.activitiesWithProjectRoleId()
  activityRepository.getAll.calledWith(interval, 1).mockResolvedValue(activitiesResponse)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.mockResolvedValue(projectRolesInformation)

  const activities = ActivityMother.activities()
  activities.sort((a, b) => (chrono(a.interval.start).isAfter(b.interval.start) ? 1 : -1))

  return {
    getActivitiesQry: new GetActivitiesQry(
      activityRepository,
      searchProjectRolesQry,
      new ActivitiesWithRoleInformation(),
      getUserLoggedQry
    ),
    activityRepository,
    searchProjectRolesQry,
    interval,
    activities
  }
}
