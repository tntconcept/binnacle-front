import { Icon, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../contexts/calendar-context'
import { handleKeyPressWhenModalIsNotOpened } from './calendar-control-utils'

export const PrevMonthArrow = () => {
  const { t } = useTranslation()
  const { selectedDate, setSelectedDate = () => {} } = useCalendarContext()

  const handlePrevMonthClick = useCallback(() => {
    const prevMonth = chrono(selectedDate).minus(1, 'month').getDate()

    setSelectedDate(prevMonth)
  }, [selectedDate, setSelectedDate])

  const handlePressedKey = (e: KeyboardEvent) => {
    handleKeyPressWhenModalIsNotOpened(e.key, 'p', handlePrevMonthClick)
  }

  useEffect(() => {
    document.addEventListener('keydown', handlePressedKey)

    return () => document.removeEventListener('keydown', handlePressedKey)
  }, [selectedDate, setSelectedDate])

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
