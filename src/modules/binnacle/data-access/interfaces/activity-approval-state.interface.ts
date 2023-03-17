export const ActivityApprovalStates = {
  NA: 'NA',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED'
} as const

export type ActivityApprovalState = keyof typeof ActivityApprovalStates
