import { GetExpensesQry } from './get-expenses-qry'
import { mock } from 'jest-mock-extended'
import { ExpenseRepository } from '../domain/expense-repository'
import { ExpenseMother } from '../../../../../test-utils/mothers/expense-mother'

describe('GetExpensesQry', () => {
  it('should return expenses', async () => {
    const { expenseRepository, getExpensesQry } = setup()
    const expenses = ExpenseMother.expenses()

    expenseRepository.getAll.mockResolvedValue(expenses)
    const response = await getExpensesQry.internalExecute({
      userId: 0,
      state: 'ACCEPTED',
      startDate: new Date(),
      endDate: new Date()
    })

    expect(response).toEqual(expenses)
  })
})

const setup = () => {
  const expenseRepository = mock<ExpenseRepository>()

  return {
    expenseRepository,
    getExpensesQry: new GetExpensesQry(expenseRepository)
  }
}
