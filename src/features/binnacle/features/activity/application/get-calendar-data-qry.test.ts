import { mock } from 'jest-mock-extended'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { GetHolidaysQry } from '../../holiday/application/get-holidays-qry'
import { GetAllVacationsForDateIntervalQry } from '../../vacation/application/get-all-vacations-for-date-interval-qry'
import { GetActivitiesQry } from './get-activities-qry'
import { GetActivitySummaryQry } from './get-activity-summary-qry'
import { GetCalendarDataQry } from './get-calendar-data-qry'

describe('GetCalendarDataQry', () => {
  it('should get the calendar data by a date interval', async () => {
    const {
      getCalendarDataQry,
      interval,
      getActivitySummary,
      getActivitiesQry,
      getHolidaysQry,
      getAllVacationsForDateIntervalQry
    } = setup()

    await getCalendarDataQry.internalExecute(interval)

    expect(getActivitySummary.execute).toBeCalledWith(interval)
    expect(getActivitiesQry.execute).toBeCalledWith(interval)
    expect(getHolidaysQry.execute).toBeCalledWith(interval)
    expect(getAllVacationsForDateIntervalQry.execute).toBeCalledWith(interval)
  })
})

function setup() {
  const getActivitySummary = mock<GetActivitySummaryQry>()
  const getActivitiesQry = mock<GetActivitiesQry>()
  const getHolidaysQry = mock<GetHolidaysQry>()
  const getAllVacationsForDateIntervalQry = mock<GetAllVacationsForDateIntervalQry>()

  const interval = {
    start: new Date('2000-03-01T09:00:00.000Z'),
    end: new Date('2000-03-01T13:00:00.000Z')
  }

  const activitySummary = ActivityMother.marchActivitySummary()
  getActivitySummary.execute.calledWith(interval).mockResolvedValue(activitySummary)

  const activities = ActivityMother.activities()
  getActivitiesQry.execute.calledWith(interval).mockResolvedValue(activities)

  return {
    getCalendarDataQry: new GetCalendarDataQry(
      getActivitySummary,
      getActivitiesQry,
      getHolidaysQry,
      getAllVacationsForDateIntervalQry
    ),
    interval,
    getActivitySummary,
    getActivitiesQry,
    getHolidaysQry,
    getAllVacationsForDateIntervalQry
  }
}
