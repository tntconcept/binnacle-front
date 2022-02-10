import i18n from 'i18next'
import { mock } from 'jest-mock-extended'
import { CreateVacationPeriodAction } from 'modules/vacations/data-access/actions/create-vacation-period-action'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import type { ToastType } from 'shared/data-access/ioc-container/ioc-container'

describe('CreateVacationPeriodAction', () => {
  it('should create vacation period and show toast with the year charged', async () => {
    const { createVacationPeriod, vacationsRepository, getVacationsByYearAction, toast } = setup()

    vacationsRepository.createVacationPeriod.mockResolvedValue([
      {
        startDate: '2020-01-01',
        endDate: '2020-01-02',
        days: 2,
        chargeYear: 2020
      }
    ])
    getVacationsByYearAction.execute.mockResolvedValue()

    await createVacationPeriod.execute({
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem ipsum..'
    })

    expect(vacationsRepository.createVacationPeriod).toHaveBeenCalledWith({
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem ipsum..'
    })
    expect(getVacationsByYearAction.execute).toHaveBeenCalledWith(undefined)

    expect(i18n.t).toHaveBeenCalledWith('vacation.create_vacation_notification_message_all', {
      year: 2020
    })

    expect(toast).toHaveBeenCalledWith({
      title: 'vacation.create_vacation_notification_title',
      description: 'vacation.create_vacation_notification_message_all',
      status: 'success',
      duration: 10_000,
      isClosable: true,
      position: 'top-right'
    })
  })

  it('should create vacation period and show toast with the ALL years charged', async () => {
    const { createVacationPeriod, vacationsRepository, getVacationsByYearAction, toast } = setup()

    vacationsRepository.createVacationPeriod.mockResolvedValue([
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

    await createVacationPeriod.execute({
      startDate: '2020-01-01',
      endDate: '2020-01-10',
      description: 'Lorem ipsum..'
    })

    expect(vacationsRepository.createVacationPeriod).toHaveBeenCalledWith({
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
  const vacationsService = mock<VacationsRepository>()
  const getVacationsByYearAction = mock<GetVacationsByYearAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    vacationsRepository: vacationsService,
    getVacationsByYearAction,
    toast,
    createVacationPeriod: new CreateVacationPeriodAction(
      vacationsService,
      getVacationsByYearAction,
      toast
    )
  }
}
