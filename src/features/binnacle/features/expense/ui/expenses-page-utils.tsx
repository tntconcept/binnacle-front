import { Expense } from '../domain/expense'
import { chrono } from '../../../../../shared/utils/chrono'
import { ExpenseState } from '../domain/expense-state'
import { EvidenceIcon } from '../../activity/ui/components/pending-activities/evidence-icon/evidence-icon'

export interface AdaptedExpense {
  key: number
  id: number
  expenseDate: string
  expenseConcept: string
  expenseAmount: string
  expenseAttachment: JSX.Element
  expenseState: ExpenseState
}

export const adaptExpensesToTable = (expenses: Expense[]): AdaptedExpense => {
  return expenses.map((expense, key) => ({
    key,
    id: expense.id,
    expenseDate: chrono(expense.date).format(chrono.DATE_FORMAT),
    expenseConcept: expense.description,
    expenseAmount: expense.amount,
    expenseAttachment: <EvidenceIcon activityId={0} evidenceKey={key} />,
    expenseState: expense.state
  }))
}
