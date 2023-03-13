import i18n from 'shared/i18n/i18n'
import { mock } from 'jest-mock-extended'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { UpdateVacationPeriodAction } from 'modules/vacations/data-access/actions/update-vacation-period-action'
import { VacationsRepository } from 'modules/vacations/data-access/interfaces/vacations-repository'
import type { ToastType } from 'shared/data-access/ioc-container/ioc-container'

describe('UpdateVacationPeriodAction', () => {
  it('should update vacation period and show toast with the year charged', async () => {
    const { updateVacationPeriod, vacationsRepository, getVacationsByYearAction, toast } = setup()

    vacationsRepository.updateVacationPeriod.mockResolvedValue([
      {
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        days: 2,
        chargeYear: 2020
      }
    ])
    getVacationsByYearAction.execute.mockResolvedValue()

    await updateVacationPeriod.execute({
      id: 100,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem ipsum..'
    })

    expect(vacationsRepository.updateVacationPeriod).toHaveBeenCalledWith({
      id: 100,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem ipsum..'
    })
    expect(getVacationsByYearAction.execute).toHaveBeenCalledWith(undefined)

    expect(toast).toHaveBeenCalledWith({
      title: 'vacation.create_vacation_notification_title',
      description: 'vacation.create_vacation_notification_message_all',
      status: 'success',
      duration: 10_000,
      isClosable: true,
      position: 'top-right'
    })

    expect(i18n.t).toHaveBeenCalledWith('vacation.create_vacation_notification_message_all', {
      year: 2020
    })
  })

  it('should update vacation period and show toast with the ALL years charged', async () => {
    const { updateVacationPeriod, vacationsRepository, getVacationsByYearAction, toast } = setup()

    vacationsRepository.updateVacationPeriod.mockResolvedValue([
      {
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        days: 2,
        chargeYear: 2020
      },
      {
        startDate: '2020-01-06',
        endDate: '2020-01-10',
        days: 5,
        chargeYear: 2020
      }
    ])
    getVacationsByYearAction.execute.mockResolvedValue()

    await updateVacationPeriod.execute({
      id: 100,
      startDate: '2020-01-01',
      endDate: '2020-01-10',
      description: 'Lorem ipsum..'
    })

    expect(vacationsRepository.updateVacationPeriod).toHaveBeenCalledWith({
      id: 100,
      startDate: '2020-01-01',
      endDate: '2020-01-10',
      description: 'Lorem ipsum..'
    })
    expect(getVacationsByYearAction.execute).toHaveBeenCalledWith(undefined)

    expect(toast).toHaveBeenCalledWith({
      title: 'vacation.create_vacation_notification_title',
      description: 'vacation.create_period_notification_message_by_year',
      status: 'success',
      duration: 10_000,
      isClosable: true,
      position: 'top-right'
    })

    expect(i18n.t).toHaveBeenCalledWith('vacation.create_period_notification_message_by_year', {
      count: 2,
      daysFirstYear: 2,
      firstYear: 2020,
      secondYear: 2020
    })
  })
})

function setup() {
  const vacationsRepository = mock<VacationsRepository>()
  const getVacationsByYearAction = mock<GetVacationsByYearAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    vacationsRepository,
    getVacationsByYearAction,
    toast,
    updateVacationPeriod: new UpdateVacationPeriodAction(
      vacationsRepository,
      getVacationsByYearAction,
      toast
    )
  }
}
