// @ts-ignore
import React, { unstable_useTransition as useTransition } from 'react'
import { ReactComponent as ChevronRight } from 'heroicons/outline/chevron-right.svg'
import { ReactComponent as ChevronLeft } from 'heroicons/outline/chevron-left.svg'
import { useTranslation } from 'react-i18next'
import DateTime from 'services/DateTime'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import { Flex, Text, HStack, IconButton, Icon } from '@chakra-ui/core'
import { SUSPENSE_CONFIG } from 'utils/constants'

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
      <ArrowButton
        direction="left"
        onClick={handlePrevMonthClick}
        data-testid="prev_month_button"
        aria-label={t('accessibility.prev_month', {
          monthStr: DateTime.format(DateTime.subMonths(selectedMonth, 1), 'LLLL yyyy')
        })}
      />
      <ArrowButton
        direction="right"
        onClick={handleNextMonthClick}
        data-testid="next_month_button"
        aria-label={t('accessibility.next_month', {
          monthStr: DateTime.format(DateTime.addMonths(selectedMonth, 1), 'LLLL yyyy')
        })}
      />
    </Flex>
  )
}

const ArrowButton: React.FC<{ direction: 'left' | 'right' } & any> = (props) => {
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)

  const handleClick = () => {
    startTransition(props.onClick)
  }

  const arrow =
    props.direction === 'right' ? (
      <Icon as={ChevronRight} boxSize={5} />
    ) : (
      <Icon as={ChevronLeft} boxSize={5} />
    )
  return (
    <IconButton
      aria-label="Search database"
      icon={arrow}
      isRound
      size="sm"
      variant="ghost"
      isLoading={isPending}
      {...props}
      onClick={handleClick}
    />
  )
}

export default CalendarControls
