import { Query, UseCaseKey } from '@archimedes/arch'
import { VACATION_REPOSITORY } from 'shared/di/container-tokens'
import { DateInterval } from 'shared/types/date-interval'
import { inject, singleton } from 'tsyringe'
import type { VacationRepository } from '../domain/vacation-repository'

@UseCaseKey('GetDaysForVacationPeriodQry')
@singleton()
export class GetDaysForVacationPeriodQry extends Query<number, DateInterval> {
  constructor(@inject(VACATION_REPOSITORY) private vacationRepository: VacationRepository) {
    super()
  }

  internalExecute(interval: DateInterval): Promise<number> {
    return this.vacationRepository.getDaysForVacationPeriod(interval)
  }
}
