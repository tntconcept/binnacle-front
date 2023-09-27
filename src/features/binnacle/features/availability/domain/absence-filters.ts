import { Id } from '../../../../../shared/types/id'

export interface AbsenceFilters {
  userIds?: Id[]
  organizationIds?: Id[]
  projectIds?: Id[]
  startDate: Date
  endDate: Date
}
