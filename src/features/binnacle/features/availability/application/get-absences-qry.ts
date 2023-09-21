import { Query, UseCaseKey } from '@archimedes/arch'
import { Absence } from '../domain/absence'
import { AbsenceFilters } from '../domain/absence-filters'
import type { AbsenceRepository } from '../domain/absence-repository'
import { inject, singleton } from 'tsyringe'
import { ABSENCE_REPOSITORY } from '../../../../../shared/di/container-tokens'

@UseCaseKey('GetAbsencesQry')
@singleton()
export class GetAbsencesQry extends Query<Absence[], AbsenceFilters> {
  constructor(@inject(ABSENCE_REPOSITORY) private absenceRepository: AbsenceRepository) {
    super()
  }

  internalExecute(absenceFilters: AbsenceFilters): Promise<Absence[]> {
    return this.absenceRepository.getAbsences(absenceFilters)
  }
}
