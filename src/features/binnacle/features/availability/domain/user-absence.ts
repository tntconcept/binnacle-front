import { Id } from '../../../../../shared/types/id'
import { Absence } from './absence'

export interface UserAbsence {
  userId: Id
  userName: string
  absences: Absence[]
}
