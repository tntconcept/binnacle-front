import { SimpleGrid } from '@chakra-ui/react'
import { chrono, eachMonthOfInterval } from 'shared/utils/chrono'
import { MonthButton } from './month-button'

interface Props {
  hiringDate: Date
  selectedYear: Date
  onClose: () => void
}

export const MonthsList = (props: Props) => {
  const startDate = chrono().set(0, 'month').set(props.selectedYear.getFullYear(), 'year').getDate()
  const endDate = chrono().set(11, 'month').set(props.selectedYear.getFullYear(), 'year').getDate()
  const months = eachMonthOfInterval({
    start: startDate,
    end: endDate
  })

  return (
    <SimpleGrid columns={4} maxWidth="275px" spacing={2}>
      {months.map((month, index) => (
        <MonthButton
          key={index}
          month={month}
          hiringDate={props.hiringDate}
          onClose={props.onClose}
        />
      ))}
    </SimpleGrid>
  )
}
