import { CellHeaderRefactor } from '../../calendar-cell/cell-header/cell-header-refactor'
import { FC } from 'react'
import { Box } from '@chakra-ui/react'
import { HeaderProps } from './header-props'

type Props = HeaderProps & {
  headerColor: string
  description: string
}

export const Leisure: FC<Props> = ({
  selectedMonth,
  date,
  description,
  headerColor,
  time,
  activities
}) => {
  return (
    <CellHeaderRefactor
      date={date}
      time={time}
      header={
        <Box position="absolute" top={0} left={0} height="6px" width="100%" bgColor={headerColor} />
      }
      description={description}
      selectedMonth={selectedMonth}
      activities={activities}
    />
  )
}
