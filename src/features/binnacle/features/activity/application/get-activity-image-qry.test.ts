import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetActivityImageQry } from './get-activity-image-qry'

describe('GetActivityImageQry', () => {
  it('should get an activity image by id', async () => {
    const { getActivityImageQry, activityRepository } = setup()
    const id = 1

    await getActivityImageQry.internalExecute(id)

    expect(activityRepository.getActivityImage).toBeCalledWith(id)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  return {
    getActivityImageQry: new GetActivityImageQry(activityRepository),
    activityRepository
  }
}
