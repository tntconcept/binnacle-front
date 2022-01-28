import { mock } from 'jest-mock-extended'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsState } from 'modules/vacations/data-access/state/vacations-state'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import type { VacationDetails } from 'modules/vacations/data-access/VacationDetails'
import type { Holidays } from 'shared/types/Holidays'

describe('GetVacationsByYearAction', () => {
  it('should get vacations by year using the year specified', async () => {
    const { getVacationsByYear, vacationsRepository, vacationsState } = setup()

    const holidays: Holidays = { holidays: [], vacations: [] }
    vacationsRepository.getVacationsByChargeYear.mockResolvedValue(holidays)

    const details: VacationDetails = { boo: true } as any
    vacationsRepository.getVacationDetailsByChargeYear.mockResolvedValue(details)

    await getVacationsByYear.execute(2100)

    expect(vacationsRepository.getVacationsByChargeYear).toHaveBeenCalledWith(2100)
    expect(vacationsRepository.getVacationDetailsByChargeYear).toHaveBeenCalledWith(2100)
    expect(vacationsState.vacations).toEqual(holidays.vacations)
    expect(vacationsState.vacationDetails).toEqual(details)
    expect(vacationsState.selectedYear).toBe(2100)
  })

  it('should get vacations by year using the current selected year', async () => {
    const { getVacationsByYear, vacationsRepository, vacationsState } = setup()
    vacationsState.selectedYear = 2200

    const holidays: Holidays = { holidays: [], vacations: [] }
    vacationsRepository.getVacationsByChargeYear.mockResolvedValue(holidays)

    const details: VacationDetails = { boo: true } as any
    vacationsRepository.getVacationDetailsByChargeYear.mockResolvedValue(details)

    await getVacationsByYear.execute()

    expect(vacationsRepository.getVacationsByChargeYear).toHaveBeenCalledWith(2200)
    expect(vacationsRepository.getVacationDetailsByChargeYear).toHaveBeenCalledWith(2200)
    expect(vacationsState.vacations).toEqual(holidays.vacations)
    expect(vacationsState.vacationDetails).toEqual(details)
    expect(vacationsState.selectedYear).toBe(2200)
  })
})

function setup() {
  const vacationsService = mock<VacationsRepository>()

  const vacationsState = new VacationsState()

  return {
    vacationsState: vacationsState,
    vacationsRepository: vacationsService,
    getVacationsByYear: new GetVacationsByYearAction(vacationsService, vacationsState)
  }
}
