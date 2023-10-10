import { Button, Text } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../contexts/calendar-context'
import { handleKeyPressWhenModalIsNotOpenedOrInputIsNotFocused } from './calendar-control-utils'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

export const TodayButton: FC = () => {
  const { t } = useTranslation()
  const { selectedDate, setSelectedDate = () => {} } = useCalendarContext()
  const [isCurrentMonth, setIsCurrentMonth] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsCurrentMonth(chrono(selectedDate).isThisMonth())
  }, [selectedDate])

  const handlePressedKey = (e: KeyboardEvent) => {
    handleKeyPressWhenModalIsNotOpenedOrInputIsNotFocused(e.key, 't', handleSetCurrentMonth)
  }

  useEffect(() => {
    document.addEventListener('keydown', handlePressedKey)

    return () => document.removeEventListener('keydown', handlePressedKey)
  }, [selectedDate, isCurrentMonth])

  const handleSetCurrentMonth = () => {
    if (isCurrentMonth) return

    setSelectedDate(new Date())
  }

  return (
    <Button variant={'outline'} onClick={handleSetCurrentMonth}>
      <Text as="span" fontSize={isMobile ? 'm' : '2xl'} fontWeight="900">
        {t('time.today')}
      </Text>
    </Button>
  )
}
