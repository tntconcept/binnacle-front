import { Icon, IconButton } from '@chakra-ui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../contexts/calendar-context'
import { useCallback, useEffect } from 'react'
import { handleKeyPressWhenBodyIsNotFocused } from './calendar-control-utils'

export const NextMonthArrow = () => {
  const { t } = useTranslation()

  const { selectedDate, setSelectedDate = () => {} } = useCalendarContext()

  const handleNextMonthClick = useCallback(() => {
    const nextMonth = chrono(selectedDate).plus(1, 'month').getDate()

    setSelectedDate(nextMonth)
  }, [selectedDate, setSelectedDate])

  const handlePressedKey = (e: KeyboardEvent) => {
    handleKeyPressWhenBodyIsNotFocused(e.key, 'n', handleNextMonthClick)
  }

  useEffect(() => {
    document.addEventListener('keydown', handlePressedKey)

    return () => document.removeEventListener('keydown', handlePressedKey)
  }, [selectedDate, setSelectedDate])

  const ariaLabel = t('accessibility.next_month', {
    monthStr: chrono(selectedDate).plus(1, 'month').format('LLLL yyyy')
  })

  return (
    <IconButton
      icon={<Icon as={ChevronRightIcon} boxSize={5} />}
      isRound
      size="sm"
      variant="ghost"
      aria-label={ariaLabel}
      data-testid="next_month_button"
      onClick={handleNextMonthClick}
    />
  )
}
