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
  // TODO: approvedByUserIdUserId can potentially be undefined because at the time we added this functionality there could have been activities that were approved beforehand, and those ones we don't know who approved them. Once we know there are no activities with this field undefined, we can remove the undefined type.
  approvedByUserId: Id | undefined
  approvalDate: Date
}

export interface NaApproval extends ActivityBaseApproval {
  state: 'NA'
  approvedByUserId?: Id
  approvalDate?: Date
}
