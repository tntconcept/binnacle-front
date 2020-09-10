import React from 'react'
import { ReactComponent as ChevronRight } from 'assets/icons/chevron-right.svg'
import { ReactComponent as ChevronLeft } from 'assets/icons/chevron-left.svg'
import { useTranslation } from 'react-i18next'
import DateTime from 'services/DateTime'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import { CalendarControlsArrowButton } from 'pages/binnacle/BinnacleDesktopLayout/CalendarControlsArrowButton'
import { Flex, Text, HStack } from '@chakra-ui/core'

const CalendarControls: React.FC = () => {
  const { t } = useTranslation()
  const { changeMonth, selectedMonth } = useBinnacleResources()

  const handleNextMonthClick = () => {
    const nextMonth = DateTime.addMonths(selectedMonth, 1)
    changeMonth(nextMonth)
  }

  const handlePrevMonthClick = async () => {
    const prevMonth = DateTime.subMonths(selectedMonth, 1)
    changeMonth(prevMonth)
  }

  return (
    <Flex align="center">
      <HStack mx="3" data-testid="selected_date">
        <Text as="span" fontSize="2xl" fontWeight="900">
          {DateTime.format(selectedMonth, 'MMMM')}
        </Text>
        <Text as="span" fontSize="2xl">
          {DateTime.format(selectedMonth, 'yyyy')}
        </Text>
      </HStack>
      <CalendarControlsArrowButton
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        aria-label={t('accessibility.prev_month', {
          monthStr: DateTime.format(
            DateTime.subMonths(selectedMonth, 1),
            'LLLL yyyy'
          )
        })}
      >
        <ChevronLeft />
      </CalendarControlsArrowButton>
      <CalendarControlsArrowButton
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
        aria-label={t('accessibility.next_month', {
          monthStr: DateTime.format(
            DateTime.addMonths(selectedMonth, 1),
            'LLLL yyyy'
          )
        })}
      >
        <ChevronRight />
      </CalendarControlsArrowButton>
    </Flex>
  )
}

export default CalendarControls
