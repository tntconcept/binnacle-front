import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetActivitySummaryQry } from './get-activity-summary-qry'

describe('GetActivitySummaryQry', () => {
  it('should get an activity summary by date', async () => {
    const { getActivitySummaryQry, activityRepository, interval } = setup()

    await getActivitySummaryQry.internalExecute(interval)

    expect(activityRepository.getActivitySummary).toBeCalledWith(interval)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const interval = {
    start: new Date('2000-03-01T09:00:00.000Z'),
    end: new Date('2000-03-01T13:00:00.000Z')
  }

  return {
    getActivitySummaryQry: new GetActivitySummaryQry(activityRepository),
    activityRepository,
    interval
  }
}
