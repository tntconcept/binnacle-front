import { Button } from '@chakra-ui/react'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../../contexts/calendar-context'

interface Props {
  month: Date
  hiringDate: Date
  onClose: any
}

export const MonthButton = (props: Props) => {
  const { setSelectedDate = () => {} } = useCalendarContext()

  const handleSelectMonth = (date: Date) => {
    const selectedMonth = chrono(date).getDate()
    setSelectedDate(selectedMonth)
    props.onClose()
  }

  const isBeforeHiringDate =
    chrono(props.month).isBefore(props.hiringDate) &&
    !chrono(props.month).isSame(props.hiringDate, 'month')
  const isAfterCurrentMonth = chrono(props.month).isAfter(new Date())

  return (
    <Button
      variant={chrono(props.month).isThisMonth() ? 'solid' : 'ghost'}
      onClick={() => handleSelectMonth(props.month)}
      isDisabled={isBeforeHiringDate || isAfterCurrentMonth}
      // isLoading={isLoading}
      size="sm"
    >
      {chrono(props.month).format('MMM')}
    </Button>
  )
}
