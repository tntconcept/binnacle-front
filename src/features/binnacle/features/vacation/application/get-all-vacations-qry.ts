import { Query, UseCaseKey } from '@archimedes/arch'
import { VACATION_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { Vacation } from '../domain/vacation'
import type { VacationRepository } from '../domain/vacation-repository'

@UseCaseKey('GetAllVacationsQry')
@singleton()
export class GetAllVacationsQry extends Query<Vacation[], number> {
  constructor(@inject(VACATION_REPOSITORY) private vacationRepository: VacationRepository) {
    super()
  }

  internalExecute(chargeYear: number): Promise<Vacation[]> {
    return this.vacationRepository.getAll(chargeYear)
  }
}
