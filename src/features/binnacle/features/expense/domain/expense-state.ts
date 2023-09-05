export const ExpenseStates = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED'
} as const

export type ExpenseState = keyof typeof ExpenseStates
