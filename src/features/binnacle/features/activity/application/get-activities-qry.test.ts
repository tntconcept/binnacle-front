import { anyArray, mock } from 'jest-mock-extended'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivitiesWithRoleInformation } from '../domain/services/activities-with-role-information'
import { GetActivitiesQry } from './get-activities-qry'

describe('GetActivitiesQry', () => {
  it('should return activities by the given interval', async () => {
    const { getActivitiesQry, interval, activities } = setup()

    const result = await getActivitiesQry.internalExecute(interval)

    expect(result).toEqual(activities)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const activitiesWithRoleInformation = mock<ActivitiesWithRoleInformation>()

  const interval = {
    start: new Date('2000-03-01T09:00:00.000Z'),
    end: new Date('2000-03-01T13:00:00.000Z')
  }

  const activitiesResponse = ActivityMother.activitiesWithProjectRoleId()
  activityRepository.getAll.calledWith(interval).mockResolvedValue(activitiesResponse)

  const projectRolesInformation = SearchMother.roles()
  searchProjectRolesQry.execute.calledWith(anyArray()).mockResolvedValue(projectRolesInformation)

  const activities = ActivityMother.activities()
  activitiesWithRoleInformation.addRoleInformationToActivities
    .calledWith(activitiesResponse, projectRolesInformation)
    .mockReturnValue(activities)

  return {
    getActivitiesQry: new GetActivitiesQry(
      activityRepository,
      searchProjectRolesQry,
      activitiesWithRoleInformation
    ),
    activityRepository,
    searchProjectRolesQry,
    activitiesWithRoleInformation,
    interval,
    activities
  }
}
