import { Query, UseCaseKey } from '@archimedes/arch'
import { VACATION_REPOSITORY } from 'shared/di/container-tokens'
import { DateInterval } from 'shared/types/date-interval'
import { inject, singleton } from 'tsyringe'
import { Vacation } from '../domain/vacation'
import type { VacationRepository } from '../domain/vacation-repository'

@UseCaseKey('GetAllVacationsForDateIntervalQry')
@singleton()
export class GetAllVacationsForDateIntervalQry extends Query<Vacation[], DateInterval> {
  constructor(@inject(VACATION_REPOSITORY) private vacationRepository: VacationRepository) {
    super()
  }

  internalExecute(interval: DateInterval): Promise<Vacation[]> {
    return this.vacationRepository.getAllForDateInterval(interval)
  }
}
