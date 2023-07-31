import { Query, UseCaseKey } from '@archimedes/arch'
import { HOLIDAY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { inject, singleton } from 'tsyringe'
import { Holiday } from '../domain/holiday'
import type { HolidayRepository } from '../domain/holiday-repository'

@UseCaseKey('GetHolidaysQry')
@singleton()
export class GetHolidaysQry extends Query<Holiday[], DateInterval> {
  constructor(@inject(HOLIDAY_REPOSITORY) private holidayRepository: HolidayRepository) {
    super()
  }
  internalExecute(interval: DateInterval): Promise<Holiday[]> {
    return this.holidayRepository.getAll(interval)
  }
}
