import { mock } from 'jest-mock-extended'
import { DeleteVacationPeriodAction } from 'modules/vacations/data-access/actions/delete-vacation-period-action'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsRepository } from 'modules/vacations/data-access/interfaces/vacations-repository'
import { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'

describe('DeleteVacationPeriodAction', () => {
  it('should delete vacation period', async () => {
    const { deleteVacationPeriod, vacationsRepository, getVacationsByYearAction } = setup()

    await deleteVacationPeriod.execute(2100)

    expect(vacationsRepository.deleteVacationPeriod).toHaveBeenCalledWith(2100)
    expect(getVacationsByYearAction.execute).toHaveBeenCalledWith()
  })
})

function setup() {
  const vacationsRepository = mock<VacationsRepository>()
  const getVacationsByYearAction = mock<GetVacationsByYearAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    vacationsRepository: vacationsRepository,
    getVacationsByYearAction: getVacationsByYearAction,
    deleteVacationPeriod: new DeleteVacationPeriodAction(
      vacationsRepository,
      getVacationsByYearAction,
      toast
    )
  }
}
