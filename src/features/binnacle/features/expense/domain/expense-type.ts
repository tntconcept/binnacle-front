export const expenseTypes = {
  STRUCTURE: 'STRUCTURE',
  MARKETING: 'MARKETING',
  OPERATION: 'OPERATION'
}

export type ExpenseType = keyof typeof expenseTypes
