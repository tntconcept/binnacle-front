import { mock } from 'jest-mock-extended'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { HolidaysRepository } from 'modules/binnacle/data-access/repositories/holidays-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import {
  mockActivityDay,
  mockHoliday,
  mockRecentRole,
  mockVacation
} from 'test-utils/generateTestMocks'
import { Holidays } from 'shared/types/Holidays'
import { GetTimeSummaryAction } from './get-time-summary-action'

beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2021-08-01').getTime())
})

describe('GetCalendarDataAction', () => {
  it('should get calendar data using the selected date of binnacle state, call get recent project roles and working time', async () => {
    const {
      getCalendarDataAction,
      activitiesRepository,
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
    expect(getTimeSummaryAction.execute).toHaveBeenCalledWith(undefined, false)

    expect(binnacleState.selectedDate).toEqual(new Date('2021-07-01'))
    expect(binnacleState.holidays).toEqual({
      holidays: holidaysResponse.holidays,
      vacations: [holidaysResponse.vacations[0]]
    })
    expect(binnacleState.activities).toEqual(activitiesResponse)
    expect(binnacleState.recentRoles).toEqual(recentProjectRolesResponse)

    jest.useRealTimers()
  })

  it('should get calendar data and get working time, not call get recent project roles', async () => {
    const {
      getCalendarDataAction,
      activitiesRepository,
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
    activitiesRepository.getActivitiesBetweenDate.mockResolvedValue(activitiesResponse)
    const recentProjectRolesResponse = [mockRecentRole({ id: 1 })]
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
    expect(activitiesRepository.getRecentProjectRoles).toHaveBeenCalled()
    expect(getTimeSummaryAction.execute).toHaveBeenCalledWith(
      new Date('2021-10-01T00:00:00.000Z'),
      false
    )
    expect(binnacleState.selectedDate).toEqual(new Date('2021-10-01'))
    expect(binnacleState.holidays).toEqual({
      holidays: holidaysResponse.holidays,
      vacations: [holidaysResponse.vacations[0]]
    })
    expect(binnacleState.activities).toEqual(activitiesResponse)
    expect(binnacleState.recentRoles).toEqual([
      {
        date: '2021-08-01T00:00:00.000Z',
        id: 1,
        name: 'Test Recent Role Name',
        organizationName: 'Test Organization Name',
        projectBillable: false,
        projectName: 'Test Recent Role Project Name',
        requireEvidence: false
      }
    ])

    jest.useRealTimers()
  })

  it('Should call working time with the data selected', async () => {
    const {
      getCalendarDataAction,
      activitiesRepository,
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
    activitiesRepository.getActivitiesBetweenDate.mockResolvedValue(activitiesResponse)
    const recentProjectRolesResponse = [mockRecentRole()]
    activitiesRepository.getRecentProjectRoles.mockResolvedValue(recentProjectRolesResponse)

    await getCalendarDataAction.execute(new Date('2020-10-01'))

    expect(getTimeSummaryAction.execute).toHaveBeenCalledWith(
      new Date('2020-10-01T00:00:00.000Z'),
      true
    )
  })
})

function setup() {
  const activitiesRepository = mock<ActivitiesRepository>()
  const holidaysRepository = mock<HolidaysRepository>()
  const binnacleState = new BinnacleState()
  const getTimeSummaryAction = mock<GetTimeSummaryAction>()

  return {
    getCalendarDataAction: new GetCalendarDataAction(
      activitiesRepository,
      holidaysRepository,
      binnacleState,
      getTimeSummaryAction
    ),
    activitiesRepository,
    holidaysRepository,
    binnacleState,
    getTimeSummaryAction
  }
}
