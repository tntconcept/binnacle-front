import { Table } from '../../../../../../shared/components/table/table'
import { FC, useMemo } from 'react'
import { ColumnsProps } from '../../../../../../shared/components/table/table.types'
import { GetExpensesQry } from '../../application/get-expenses-qry'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { adaptExpensesToTable } from '../expenses-page-utils'

export const ExpenseTable: FC = () => {
  const { result: expenses } = useExecuteUseCaseOnMount(GetExpensesQry)

  const tableExpenses = useMemo(() => {
    if (!expenses) return []
    return adaptExpensesToTable(expenses)
  }, [expenses])

  const columns: ColumnsProps[] = [
    {
      title: 'expenses.date',
      dataIndex: 'expenseDate',
      key: 'expenseDate',
      showInMobile: true
    },
    {
      title: 'expenses.concept',
      dataIndex: 'expenseConcept',
      key: 'expenseConcept',
      showInMobile: true
    },
    {
      title: 'expenses.amount',
      dataIndex: 'expenseAmount',
      key: 'expenseAmount',
      showInMobile: true
    },
    {
      title: 'expenses.attachment',
      dataIndex: 'expenseAttachment',
      key: 'expenseAttachment',
      showInMobile: true
    },
    {
      title: 'expenses.state',
      dataIndex: 'expenseState',
      key: 'expenseState',
      showInMobile: true
    }
  ]

  return (
    <Table columns={columns} dataSource={tableExpenses} emptyTableKey={'expenses.empty'}></Table>
  )
}
