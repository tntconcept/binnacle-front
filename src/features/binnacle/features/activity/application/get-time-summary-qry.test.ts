import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetTimeSummaryQry } from './get-time-summary-qry'

describe('GetTimeSummaryQry', () => {
  it('should get time summary by date', async () => {
    const { getTimeSummaryQry, activityRepository } = setup()
    const date = new Date('2000-03-01T09:00:00.000Z')

    await getTimeSummaryQry.internalExecute(date)

    expect(activityRepository.getTimeSummary).toBeCalledWith(date)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  return {
    getTimeSummaryQry: new GetTimeSummaryQry(activityRepository),
    activityRepository
  }
}
