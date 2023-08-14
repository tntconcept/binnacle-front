import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { HolidayMother } from '../../../../../test-utils/mothers/holiday-mother'
import { HolidayRepository } from '../domain/holiday-repository'
import { GetHolidaysQry } from './get-holidays-qry'

describe('GetHolidaysQry', () => {
  it('should get holidays from repository', async () => {
    const { getHolidayQry, holidayRepository } = setup()
    const holidays = HolidayMother.marchHolidays()
    const start = holidays.at(0)!.date
    const end = holidays.at(-1)!.date
    holidayRepository.getAll.mockResolvedValue(holidays)

    const response = await getHolidayQry.internalExecute({ start, end })

    expect(holidayRepository.getAll).toHaveBeenCalled()
    expect(response).toEqual(holidays)
  })
})

function setup() {
  const holidayRepository = mock<HolidayRepository>()

  return {
    holidayRepository,
    getHolidayQry: new GetHolidaysQry(holidayRepository)
  }
}
