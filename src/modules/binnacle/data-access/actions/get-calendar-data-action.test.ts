import { mock } from 'jest-mock-extended'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { HolidaysRepository } from 'modules/binnacle/data-access/repositories/holidays-repository'
import { GetTimeBalanceByMonthAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-month-action'
import { GetTimeBalanceByYearAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-year-action'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import {
  mockActivityDay,
  mockHoliday,
  mockRecentRole,
  mockVacation
} from 'test-utils/generateTestMocks'
import { Holidays } from 'shared/types/Holidays'

describe('GetCalendarDataAction', () => {
  it('should get calendar data using the selected date of binnacle state, call get recent project roles and time balance by month', async () => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2021-08-01').getTime())

    const {
      getCalendarDataAction,
      activitiesRepository,
      holidaysRepository,
      binnacleState,
      getTimeBalanceByMonthAction
    } = setup()
    binnacleState.selectedDate = new Date('2021-07-01')
    binnacleState.selectedTimeBalanceMode = 'by-month'

    const holidaysResponse: Holidays = {
      holidays: [mockHoliday()],
      vacations: [mockVacation({ state: 'ACCEPT' }), mockVacation({ state: 'REJECT' })]
    }
    holidaysRepository.getHolidays.mockResolvedValue(holidaysResponse)

    const activitiesResponse = [mockActivityDay()]
    activitiesRepository.getActivitiesBetweenDate.mockResolvedValue(activitiesResponse)

    const recentProjectRolesResponse = [mockRecentRole()]
    activitiesRepository.getRecentProjectRoles.mockResolvedValue(recentProjectRolesResponse)

    await getCalendarDataAction.execute()

    expect(holidaysRepository.getHolidays).toHaveBeenCalledWith(
      new Date('2021-06-27T22:00:00.000Z'),
      new Date('2021-08-01T21:59:59.999Z')
    )
    expect(activitiesRepository.getActivitiesBetweenDate).toHaveBeenCalledWith(
      new Date('2021-06-27T22:00:00.000Z'),
      new Date('2021-08-01T21:59:59.999Z')
    )
    expect(activitiesRepository.getRecentProjectRoles).toHaveBeenCalled()
    expect(getTimeBalanceByMonthAction.execute).toHaveBeenCalledWith(new Date('2021-07-01'))

    expect(binnacleState.selectedDate).toEqual(new Date('2021-07-01'))
    expect(binnacleState.holidays).toEqual({
      holidays: holidaysResponse.holidays,
      vacations: [holidaysResponse.vacations[0]]
    })
    expect(binnacleState.activities).toEqual(activitiesResponse)
    expect(binnacleState.recentRoles).toEqual(recentProjectRolesResponse)

    jest.useRealTimers()
  })

  it('should get calendar data and get time balance by month, not call get recent project roles', async () => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2021-08-01').getTime())

    const {
      getCalendarDataAction,
      activitiesRepository,
      holidaysRepository,
      binnacleState,
      getTimeBalanceByYearAction
    } = setup()
    binnacleState.selectedDate = new Date('2021-07-01')
    binnacleState.selectedTimeBalanceMode = 'by-year'

    const holidaysResponse: Holidays = {
      holidays: [mockHoliday()],
      vacations: [mockVacation({ state: 'ACCEPT' }), mockVacation({ state: 'REJECT' })]
    }
    holidaysRepository.getHolidays.mockResolvedValue(holidaysResponse)

    const activitiesResponse = [mockActivityDay()]
    activitiesRepository.getActivitiesBetweenDate.mockResolvedValue(activitiesResponse)

    const recentProjectRolesResponse = [mockRecentRole()]
    activitiesRepository.getRecentProjectRoles.mockResolvedValue(recentProjectRolesResponse)

    await getCalendarDataAction.execute(new Date('2021-10-01'))

    expect(holidaysRepository.getHolidays).toHaveBeenCalledWith(
      new Date('2021-09-26T22:00:00.000Z'),
      new Date('2021-10-31T22:59:59.999Z')
    )
    expect(activitiesRepository.getActivitiesBetweenDate).toHaveBeenCalledWith(
      new Date('2021-09-26T22:00:00.000Z'),
      new Date('2021-10-31T22:59:59.999Z')
    )
    expect(activitiesRepository.getRecentProjectRoles).not.toHaveBeenCalled()
    expect(getTimeBalanceByYearAction.execute).toHaveBeenCalledWith(new Date('2021-10-01'))

    expect(binnacleState.selectedDate).toEqual(new Date('2021-10-01'))
    expect(binnacleState.holidays).toEqual({
      holidays: holidaysResponse.holidays,
      vacations: [holidaysResponse.vacations[0]]
    })
    expect(binnacleState.activities).toEqual(activitiesResponse)
    expect(binnacleState.recentRoles).toEqual([])

    jest.useRealTimers()
  })
})

function setup() {
  const activitiesRepository = mock<ActivitiesRepository>()
  const holidaysRepository = mock<HolidaysRepository>()
  const binnacleState = new BinnacleState()
  const getTimeBalanceByMonthAction = mock<GetTimeBalanceByMonthAction>()
  const getTimeBalanceByYearAction = mock<GetTimeBalanceByYearAction>()

  return {
    getCalendarDataAction: new GetCalendarDataAction(
      activitiesRepository,
      holidaysRepository,
      binnacleState,
      getTimeBalanceByMonthAction,
      getTimeBalanceByYearAction
    ),
    activitiesRepository,
    holidaysRepository,
    binnacleState,
    getTimeBalanceByMonthAction,
    getTimeBalanceByYearAction
  }
}
