import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetActivityRegisteredTimeQry } from './get-activity-registered-time-qry'

describe('GetActivityRegisteredTimeQry', () => {
  it('should get an activity summary by a date interval', async () => {
    const { getActivityRegisteredTimeQry, activityRepository, roleId, date } = setup()

    await getActivityRegisteredTimeQry.internalExecute({ roleId, date })

    expect(activityRepository.getActivityRegisteredTimeQry).toBeCalledWith(roleId, date)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const date = new Date('2023-03-01T09:00:00.000Z')
  const roleId = 1

  return {
    getActivityRegisteredTimeQry: new GetActivityRegisteredTimeQry(activityRepository),
    activityRepository,
    roleId,
    date
  }
}
