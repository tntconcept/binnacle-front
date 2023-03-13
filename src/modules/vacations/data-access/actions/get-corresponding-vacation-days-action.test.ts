import { mock } from 'jest-mock-extended'
import { GetCorrespondingVacationDaysAction } from 'modules/vacations/data-access/actions/get-corresponding-vacation-days-action'
import { VacationsRepository } from 'modules/vacations/data-access/interfaces/vacations-repository'

describe('GetCorrespondingVacationDaysAction', () => {
  it('should get corresponding vacation days', async () => {
    const { getCorrespondingVacationDays, vacationsRepository } = setup()

    await getCorrespondingVacationDays.execute({ startDate: '2020-01-01', endDate: '2020-01-02' })

    expect(vacationsRepository.getCorrespondingVacationDays).toHaveBeenCalledWith(
      '2020-01-01',
      '2020-01-02'
    )
  })
})

function setup() {
  const vacationsRepository = mock<VacationsRepository>()
  return {
    vacationsRepository: vacationsRepository,
    getCorrespondingVacationDays: new GetCorrespondingVacationDaysAction(vacationsRepository)
  }
}
