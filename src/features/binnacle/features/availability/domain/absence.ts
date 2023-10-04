import { AbsenceType } from './absence-type'

export interface Absence {
  type: AbsenceType
  startDate: Date
  endDate: Date
}
