import { Absence } from './absence'
import { AbsenceFilters } from './absence-filters'

export interface AbsenceRepository {
  getAbsences(absenceFilters: AbsenceFilters): Promise<Absence[]>
}
