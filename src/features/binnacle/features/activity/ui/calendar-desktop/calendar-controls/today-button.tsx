import { Button, Text } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useCalendarContext } from '../../contexts/calendar-context'
import { handleKeyPressWhenModalIsNotOpened } from './calendar-control-utils'

export const TodayButton: FC = () => {
  const { t } = useTranslation()
  const { selectedDate, setSelectedDate = () => {} } = useCalendarContext()
  const [isCurrentMonth, setIsCurrentMonth] = useState(false)

  useEffect(() => {
    setIsCurrentMonth(chrono(selectedDate).isThisMonth())
  }, [selectedDate])

  const handlePressedKey = (e: KeyboardEvent) => {
    handleKeyPressWhenModalIsNotOpened(e.key, 't', handleSetCurrentMonth)
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
      <Text as="span" fontSize="2xl" fontWeight="900">
        {t('time.today')}
      </Text>
    </Button>
  )
}
