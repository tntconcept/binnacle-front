import { FC } from 'react'
import { Leisure } from './leisure'
import { LeisureProps } from './leisure-props'
import { Holiday } from '../../../../../../holiday/domain/holiday'

type Props = LeisureProps & {
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
