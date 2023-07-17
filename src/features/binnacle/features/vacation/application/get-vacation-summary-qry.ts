import { Query, UseCaseKey } from '@archimedes/arch'
import { VACATION_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { VacationRepository } from '../domain/vacation-repository'
import type { VacationSummary } from '../domain/vacation-summary'

@UseCaseKey('GetVacationSummaryQry')
@singleton()
export class GetVacationSummaryQry extends Query<VacationSummary, number> {
  constructor(@inject(VACATION_REPOSITORY) private vacationRepository: VacationRepository) {
    super()
  }

  internalExecute(chargeYear: number): Promise<VacationSummary> {
    return this.vacationRepository.getVacationSummary(chargeYear)
  }
}
