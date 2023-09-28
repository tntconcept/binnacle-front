import { Query, UseCaseKey } from '@archimedes/arch'
import { AbsenceFilters } from '../domain/absence-filters'
import type { AbsenceRepository } from '../domain/absence-repository'
import { inject, singleton } from 'tsyringe'
import { ABSENCE_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { UserAbsence } from '../domain/user-absence'

@UseCaseKey('GetAbsencesQry')
@singleton()
export class GetAbsencesQry extends Query<UserAbsence[], AbsenceFilters> {
  constructor(@inject(ABSENCE_REPOSITORY) private absenceRepository: AbsenceRepository) {
    super()
  }

  internalExecute(absenceFilters: AbsenceFilters): Promise<UserAbsence[]> {
    return this.absenceRepository.getAbsences(absenceFilters)
  }
}
