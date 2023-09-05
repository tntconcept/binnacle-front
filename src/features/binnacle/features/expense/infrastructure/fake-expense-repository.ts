import { ExpenseRepository } from '../domain/expense-repository'
import { Expense } from '../domain/expense'
import { ExpenseMother } from '../../../../../test-utils/mothers/expense-mother'
import { singleton } from 'tsyringe'

@singleton()
export class FakeExpenseRepository implements ExpenseRepository {
  async getAll(): Promise<Expense[]> {
    return ExpenseMother.expenses()
  }
}
