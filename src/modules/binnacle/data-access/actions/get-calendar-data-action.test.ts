import { mock } from 'jest-mock-extended'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { HolidaysRepository } from 'modules/binnacle/data-access/interfaces/holidays-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import {
  buildActivityDaySummary,
  mockActivityDay,
  mockHoliday,
  mockRecentRole,
  mockVacation
} from 'test-utils/generateTestMocks'
import { Holidays } from 'shared/types/Holidays'
import { GetTimeSummaryAction } from './get-time-summary-action'
import type { ActivityRepository } from '../interfaces/activity-repository'

beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2021-08-01').getTime())
})

describe('GetCalendarDataAction', () => {
  it('should get calendar data using the selected date of binnacle state, call get recent project roles and working time', async () => {
    const {
      getCalendarDataAction,
      activityRepository,
      holidaysRepository,
      binnacleState,
      getTimeSummaryAction
    } = setup()
    binnacleState.selectedDate = new Date('2021-07-01')
    const holidaysResponse: Holidays = {
      holidays: [mockHoliday()],
      vacations: [mockVacation({ state: 'ACCEPT' }), mockVacation({ state: 'REJECT' })]
    }
    holidaysRepository.getHolidays.mockResolvedValue(holidaysResponse)
    const activitiesResponse = [mockActivityDay()]
    activityRepository.getActivities.mockResolvedValue(activitiesResponse)
    const recentProjectRolesResponse = [mockRecentRole()]
    activityRepository.getRecentProjectRoles.mockResolvedValue(recentProjectRolesResponse)
    const activityDaySummaryResponse = buildActivityDaySummary()
    activityRepository.getActivitySummary.mockResolvedValue(activityDaySummaryResponse)

    await getCalendarDataAction.execute()

    expect(holidaysRepository.getHolidays).toHaveBeenCalledWith(
      new Date('2021-06-27T22:00:00.000Z'),
      new Date('2021-08-01T21:59:59.999Z')
    )
    expect(activityRepository.getActivities).toHaveBeenCalledWith(
      new Date('2021-06-27T22:00:00.000Z'),
      new Date('2021-08-01T21:59:59.999Z')
    )
    expect(activityRepository.getActivitySummary).toHaveBeenCalledWith(
      new Date('2021-06-27T22:00:00.000Z'),
      new Date('2021-08-01T21:59:59.999Z')
    )
    expect(activityRepository.getRecentProjectRoles).toHaveBeenCalled()
    expect(getTimeSummaryAction.execute).toHaveBeenCalledWith(undefined, false)

    expect(binnacleState.selectedDate).toEqual(new Date('2021-07-01'))
    expect(binnacleState.holidays).toEqual({
      holidays: holidaysResponse.holidays,
      vacations: [holidaysResponse.vacations[0]]
    })
    expect(binnacleState.activities).toEqual(activitiesResponse)
    expect(binnacleState.recentRoles).toEqual(recentProjectRolesResponse)
    expect(binnacleState.activitiesDaySummary).toEqual(activityDaySummaryResponse)

    jest.useRealTimers()
  })

  it('should call working time with the date send by parameter and not selected date', async () => {
    const {
      getCalendarDataAction,
      activityRepository,
      holidaysRepository,
      binnacleState,
      getTimeSummaryAction
    } = setup()
    binnacleState.selectedDate = new Date('2021-07-01')
    holidaysRepository.getHolidays.mockResolvedValue({ holidays: [], vacations: [] } as Holidays)
    activityRepository.getActivities.mockResolvedValue([])
    activityRepository.getRecentProjectRoles.mockResolvedValue([])

    await getCalendarDataAction.execute(new Date('2020-10-01'))

    expect(getTimeSummaryAction.execute).toHaveBeenCalledWith(
      new Date('2020-10-01T00:00:00.000Z'),
      true
    )
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const holidaysRepository = mock<HolidaysRepository>()
  const binnacleState = new BinnacleState()
  const getTimeSummaryAction = mock<GetTimeSummaryAction>()

  return {
    getCalendarDataAction: new GetCalendarDataAction(
      activityRepository,
      holidaysRepository,
      binnacleState,
      getTimeSummaryAction
    ),
    activityRepository,
    holidaysRepository,
    binnacleState,
    getTimeSummaryAction
  }
}
