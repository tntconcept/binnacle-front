import { mock } from 'jest-mock-extended'
import { VacationMother } from '../../../../../test-utils/mothers/vacation-mother'
import { VacationRepository } from '../domain/vacation-repository'
import { CreateVacationCmd } from './create-vacation.cmd'
import { VacationGenerated } from '../domain/vacation-generated'
import { NewVacation } from '../domain/new-vacation'
import { i18n } from '../../../../../shared/i18n/i18n'

describe('CreateVacationCmd', () => {
  it('should create a new vacation', async () => {
    const { createVacationCmd, vacationRepository, toast } = setup()
    const vacationPeriodResponse: VacationGenerated[] = [VacationMother.julyVacationGenerated()]
    const vacationPeriodRequest: NewVacation = {
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-02'),
      description: 'Lorem Ipsum'
    }
    vacationRepository.create.mockResolvedValue(vacationPeriodResponse)

    await createVacationCmd.internalExecute(vacationPeriodRequest)

    expect(vacationRepository.create).toHaveBeenCalledWith(vacationPeriodRequest)
    expect(toast).toHaveBeenCalledWith({
      title: i18n.t('vacation.create_vacation_notification_title'),
      description: 'vacation.create_vacation_notification_message_all',
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  })

  it('should create a new vacation with a toast message with a different message ', async () => {
    const { createVacationCmd, vacationRepository, toast } = setup()
    const vacationPeriodResponse: VacationGenerated[] = VacationMother.vacationsGenerated()
    const vacationPeriodRequest: NewVacation = {
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-02'),
      description: 'Lorem Ipsum'
    }
    vacationRepository.create.mockResolvedValue(vacationPeriodResponse)

    await createVacationCmd.internalExecute(vacationPeriodRequest)

    expect(vacationRepository.create).toHaveBeenCalledWith(vacationPeriodRequest)
    expect(toast).toHaveBeenCalledWith({
      title: i18n.t('vacation.create_vacation_notification_title'),
      description: 'vacation.create_period_notification_message_by_year',
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  })
})

function setup() {
  const vacationRepository = mock<VacationRepository>()
  const toast = jest.fn() as any

  const newVacation = VacationMother.julyVacation()

  return {
    createVacationCmd: new CreateVacationCmd(vacationRepository, toast),
    vacationRepository,
    toast,
    newVacation
  }
}
