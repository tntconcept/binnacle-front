import { AbsenceFilters } from './absence-filters'
import { UserAbsence } from './user-absence'

export interface AbsenceRepository {
  getAbsences(absenceFilters: AbsenceFilters): Promise<UserAbsence[]>
}
