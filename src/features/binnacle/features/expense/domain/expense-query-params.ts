import { ExpenseState } from './expense-state'
import { Id } from '../../../../../shared/types/id'

export interface ExpenseQueryParams {
  startDate: Date
  endDate: Date
  state: ExpenseState
  userId: Id
}
