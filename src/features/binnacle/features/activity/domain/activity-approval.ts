import { ActivityApprovalState } from './activity-approval-state'
import { Id } from '../../../../../shared/types/id'

export type ActivityApproval = PendingApproval | AcceptedApproval | NaApproval

export interface ActivityBaseApproval {
  state: ActivityApprovalState
  approvedByUserName?: string
}

export interface PendingApproval extends ActivityBaseApproval {
  state: 'PENDING'
  approvedByUserId?: Id
  approvalDate?: Date
}

export interface AcceptedApproval extends ActivityBaseApproval {
  state: 'ACCEPTED'
  approvedByUserId: Id
  approvalDate: Date
}

export interface NaApproval extends ActivityBaseApproval {
  state: 'NA'
  approvedByUserId?: Id
  approvalDate?: Date
}
