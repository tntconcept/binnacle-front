import { Expense } from './expense'
import { ExpenseQueryParams } from './expense-query-params'

export interface ExpenseRepository {
  getAll(params: ExpenseQueryParams): Promise<Expense[]>
}
