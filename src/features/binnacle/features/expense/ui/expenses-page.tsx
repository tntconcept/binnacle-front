import { FC } from 'react'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { Stack } from '@chakra-ui/react'
import { ExpenseTable } from './components/expense-table'

export const ExpensesPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageWithTitle title={t('pages.expenses')}>
      <Stack>
        <ExpenseTable />
      </Stack>
    </PageWithTitle>
  )
}

export default ExpensesPage
