import { Icon, IconButton } from '@chakra-ui/react'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import chrono from 'shared/utils/chrono'

interface Props {
  selectedDate: Date | string
}

export const NextMonthArrow = (props: Props) => {
  const { t } = useTranslation()

  const [loadCalendarData, loading] = useActionLoadable(GetCalendarDataAction)

  const handleNextMonthClick = async () => {
    const nextMonth = chrono(props.selectedDate)
      .plus(1, 'month')
      .getDate()
    await loadCalendarData(nextMonth)
  }

  const ariaLabel = t('accessibility.next_month', {
    monthStr: chrono(props.selectedDate)
      .plus(1, 'month')
      .format('LLLL yyyy')
  })

  return (
    <IconButton
      icon={<Icon as={ChevronRightIcon} boxSize={5} />}
      isRound
      size="sm"
      variant="ghost"
      isLoading={loading}
      aria-label={ariaLabel}
      data-testid="next_month_button"
      onClick={handleNextMonthClick}
    />
  )
}
