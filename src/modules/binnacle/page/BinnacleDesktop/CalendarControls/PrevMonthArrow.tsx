import { Icon, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import chrono from 'shared/utils/chrono'

interface Props {
  selectedDate: Date | string
}

export const PrevMonthArrow = (props: Props) => {
  const { t } = useTranslation()

  const [loadCalendarData, loading] = useActionLoadable(GetCalendarDataAction)

  const handlePrevMonthClick = async () => {
    const prevMonth = chrono(props.selectedDate).minus(1, 'month').getDate()

    await loadCalendarData(prevMonth)
  }

  const ariaLabel = t('accessibility.prev_month', {
    monthStr: chrono(props.selectedDate).minus(1, 'month').format('LLLL yyyy')
  })

  return (
    <IconButton
      icon={<Icon as={ChevronLeftIcon} boxSize={5} />}
      isRound
      size="sm"
      variant="ghost"
      isLoading={loading}
      aria-label={ariaLabel}
      data-testid="prev_month_button"
      onClick={handlePrevMonthClick}
    />
  )
}
