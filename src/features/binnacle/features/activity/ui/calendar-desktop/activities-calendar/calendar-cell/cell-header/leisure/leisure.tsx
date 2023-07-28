import { CellHeaderRefactor } from '../cell-header-refactor'
import { forwardRef } from 'react'
import { Box } from '@chakra-ui/react'
import { CellHeaderProps } from '../cell-header-props'

type Props = CellHeaderProps & {
  headerColor: string
  description: string
}

export const Leisure = forwardRef<HTMLButtonElement, Props>(
  ({ selectedMonth, date, description, headerColor, time, activities }, ref) => {
    return (
      <CellHeaderRefactor
        ref={ref}
        date={date}
        time={time}
        header={
          <Box
            position="absolute"
            top={0}
            left={0}
            height="6px"
            width="100%"
            bgColor={headerColor}
          />
        }
        description={description}
        selectedMonth={selectedMonth}
        activities={activities}
      />
    )
  }
)

Leisure.displayName = 'Leisure'
