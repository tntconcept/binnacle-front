import { Icon, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import chrono from 'shared/utils/chrono'
import { useCalendarContext } from '../../contexts/calendar-context'

export const PrevMonthArrow = () => {
  const { t } = useTranslation()
  const { selectedDate, setSelectedDate = () => {} } = useCalendarContext()

  const handlePrevMonthClick = useCallback(() => {
    const prevMonth = chrono(selectedDate).minus(1, 'month').getDate()

    setSelectedDate(prevMonth)
  }, [selectedDate])

  const ariaLabel = t('accessibility.prev_month', {
    monthStr: chrono(selectedDate).minus(1, 'month').format('LLLL yyyy')
  })

  return (
    <IconButton
      icon={<Icon as={ChevronLeftIcon} boxSize={5} />}
      isRound
      size="sm"
      variant="ghost"
      aria-label={ariaLabel}
      data-testid="prev_month_button"
      onClick={handlePrevMonthClick}
    />
  )
}
