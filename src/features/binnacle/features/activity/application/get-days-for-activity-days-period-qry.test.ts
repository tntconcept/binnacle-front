import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetDaysForActivityDaysPeriodQry } from './get-days-for-activity-days-period-qry'

describe('GetDaysForActivityDaysPeriodQry', () => {
  it('should get a number of days by a date interval', async () => {
    const { getDaysForActivityDaysPeriodQry, activityRepository, interval } = setup()

    await getDaysForActivityDaysPeriodQry.internalExecute(interval)

    expect(activityRepository.getDaysForActivityDaysPeriod).toBeCalledWith(interval)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const interval = {
    start: new Date('2000-03-01T09:00:00.000Z'),
    end: new Date('2000-03-01T13:00:00.000Z')
  }

  return {
    getDaysForActivityDaysPeriodQry: new GetDaysForActivityDaysPeriodQry(activityRepository),
    activityRepository,
    interval
  }
}
