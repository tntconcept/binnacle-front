import { Button } from '@chakra-ui/react'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import chrono from 'shared/utils/chrono'

interface Props {
  month: Date
  hiringDate: Date
  onClose: any
}

export const MonthButton = (props: Props) => {
  const [loadBinnacleData, isLoading] = useActionLoadable(GetCalendarDataAction)
  const handleSelectMonth = async (date: Date) => {
    await loadBinnacleData(date)
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
      isLoading={isLoading}
      size="sm"
    >
      {chrono(props.month).format('MMM')}
    </Button>
  )
}
