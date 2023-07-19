import { ActivityApprovalState } from './activity-approval-state'

export type ActivityApproval = PendingApproval | AcceptedApproval | NaApproval

export interface ActivityBaseApproval {
  state: ActivityApprovalState
}

export interface PendingApproval extends ActivityBaseApproval {
  state: 'PENDING'
  approvedByUserName?: string
  approvalDate?: Date
}

export interface AcceptedApproval extends ActivityBaseApproval {
  state: 'ACCEPTED'
  approvedByUserName: string
  approvalDate: Date
}

export interface NaApproval extends ActivityBaseApproval {
  state: 'NA'
  approvedByUserName?: string
  approvalDate?: Date
}
