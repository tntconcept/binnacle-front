import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetDaysForActivityNaturalDaysPeriodQry } from './get-days-for-activity-natural-days-period-qry'

describe('GetDaysForActivityNaturalDaysPeriodQry', () => {
  it('should get a number of days by a date interval', async () => {
    const { getDaysForActivityNaturalDaysPeriodQry, activityRepository, interval } = setup()

    await getDaysForActivityNaturalDaysPeriodQry.internalExecute({ roleId: 1, interval })

    expect(activityRepository.getDaysForActivityNaturalDaysPeriod).toBeCalledWith(1, interval)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const interval = {
    start: new Date('2000-03-01T09:00:00.000Z'),
    end: new Date('2000-03-01T13:00:00.000Z')
  }

  return {
    getDaysForActivityNaturalDaysPeriodQry: new GetDaysForActivityNaturalDaysPeriodQry(
      activityRepository
    ),
    activityRepository,
    interval
  }
}
