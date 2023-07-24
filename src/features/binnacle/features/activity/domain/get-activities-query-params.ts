import { Id } from '../../../../../shared/types/id'
import { ActivityApprovalStateFilter } from './activity-approval-state-filter'

export interface GetActivitiesQueryParams {
  userId?: Id
  approvalState: ActivityApprovalStateFilter
  startDate: string
  endDate: string
}
