export const ActivityApprovalStateFilters = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED'
} as const

export type ActivityApprovalStateFilter = keyof typeof ActivityApprovalStateFilters
