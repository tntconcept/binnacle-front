import { Id } from '../../../../../shared/types/id'
import { ExpenseState } from './expense-state'
import { ExpenseType } from './expense-type'

export interface Expense {
  id: Id
  date: Date
  description: string
  amount: string
  userId: number
  state: ExpenseState
  type: ExpenseType | null
  documents: string[]
}
