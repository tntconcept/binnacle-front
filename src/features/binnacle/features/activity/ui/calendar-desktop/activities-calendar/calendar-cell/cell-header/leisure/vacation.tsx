import { forwardRef } from 'react'
import { Leisure } from './leisure'
import { CellHeaderProps } from '../cell-header-props'
import { useTranslation } from 'react-i18next'

type Props = CellHeaderProps

export const Vacation = forwardRef<HTMLButtonElement, Props>(
  ({ date, selectedMonth, time, activities }, ref) => {
    const { t } = useTranslation()

    return (
      <Leisure
        ref={ref}
        date={date}
        time={time}
        headerColor={'blue.400'}
        description={t('vacation.title')}
        selectedMonth={selectedMonth}
        activities={activities}
      />
    )
  }
)

Vacation.displayName = 'Vacation'
