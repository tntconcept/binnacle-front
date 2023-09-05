import { Query, UseCaseKey } from '@archimedes/arch'
import { Expense } from '../domain/expense'
import { ExpenseQueryParams } from '../domain/expense-query-params'
import { inject, singleton } from 'tsyringe'
import { EXPENSE_REPOSITORY } from '../../../../../shared/di/container-tokens'
import type { ExpenseRepository } from '../domain/expense-repository'

@UseCaseKey('GetExpensesQry')
@singleton()
export class GetExpensesQry extends Query<Expense[], ExpenseQueryParams> {
  constructor(@inject(EXPENSE_REPOSITORY) private expenseRepository: ExpenseRepository) {
    super()
  }

  internalExecute(params: ExpenseQueryParams): Promise<Expense[]> {
    return this.expenseRepository.getAll(params)
  }
}
