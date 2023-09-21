import { Id } from '../../../../../shared/types/id'
import { AbsenceType } from './absence-type'

export interface Absence {
  userId: Id
  userName: string
  type: AbsenceType
  startDate: Date
  endDate: Date
}
