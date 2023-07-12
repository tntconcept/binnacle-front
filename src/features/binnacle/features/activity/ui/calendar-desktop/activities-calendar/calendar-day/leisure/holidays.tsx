import { FC } from 'react'
import { Leisure } from './leisure'
import { HeaderProps } from './header-props'
import { Holiday } from '../../../../../../holiday/domain/holiday'

type Props = HeaderProps & {
  holiday: Holiday
}

export const Holidays: FC<Props> = ({ date, holiday, selectedMonth, time, activities }) => {
  return (
    <Leisure
      date={date}
      time={time}
      headerColor={'yellow.400'}
      description={holiday.description}
      selectedMonth={selectedMonth}
      activities={activities}
    />
  )
}
