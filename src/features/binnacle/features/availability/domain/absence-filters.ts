import { Id } from '../../../../../shared/types/id'

export interface AbsenceFilters {
  userIds?: Id[]
  organizationIds?: Id[]
  projectIds?: Id[]
  startDate: string
  endDate: string
}
