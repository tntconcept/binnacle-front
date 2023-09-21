import { Id } from '../../../../../shared/types/id'

export interface AbsenceFilters {
  userId: Id
  organizationId: Id
  projectId: Id
  startDate: Date
  endDate: Date
}
