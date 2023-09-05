import { Expense } from '../../features/binnacle/features/expense/domain/expense'

export class ExpenseMother {
  static expenses(): Expense[] {
    return [
      {
        id: 12,
        date: new Date('2023-08-01'),
        description: 'Taxi hotel',
        amount: '25.75',
        userId: 2,
        state: 'PENDING',
        type: null,
        documents: ['e80175e3-3ab4-4306-af1e-a8a6c0844e4b']
      }
    ]
  }
}
