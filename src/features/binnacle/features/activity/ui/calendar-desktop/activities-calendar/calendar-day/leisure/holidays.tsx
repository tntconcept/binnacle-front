import { forwardRef } from 'react'
import { HeaderProps } from './header-props'
import { Holiday } from '../../../../../../holiday/domain/holiday'
import { Leisure } from './leisure'

type Props = HeaderProps & {
  holiday: Holiday
}

export const Holidays = forwardRef<HTMLButtonElement, Props>(
  ({ date, holiday, selectedMonth, activities, time }, ref) => {
    return (
      <Leisure
        ref={ref}
        date={date}
        time={time}
        headerColor={'yellow.400'}
        description={holiday.description}
        selectedMonth={selectedMonth}
        activities={activities}
      />
    )
  }
)

Holidays.displayName = 'Holidays'
