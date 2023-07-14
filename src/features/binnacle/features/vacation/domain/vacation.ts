import { Id } from '../../../../../shared/types/id'
import { VacationStatus } from './vacation-status'

export interface Vacation {
  id: Id
  observations?: string
  description?: string
  state: VacationStatus
  startDate: Date
  endDate: Date
  days: Date[]
  chargeYear: Date
}
