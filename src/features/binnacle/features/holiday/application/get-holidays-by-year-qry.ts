import { Query, UseCaseKey } from '@archimedes/arch'
import { inject, singleton } from 'tsyringe'
import { Holiday } from '../domain/holiday'
import { HOLIDAY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import type { HolidayRepository } from '../domain/holiday-repository'

@UseCaseKey('GetHolidayByYearQry')
@singleton()
export class GetHolidaysByYearQry extends Query<Holiday[], number> {
  constructor(@inject(HOLIDAY_REPOSITORY) private holidayRepository: HolidayRepository) {
    super()
  }

  internalExecute(year: number): Promise<Holiday[]> {
    return this.holidayRepository.getHolidaysByYear(year)
  }
}
