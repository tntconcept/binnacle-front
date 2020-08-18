import { useMonth } from '@datepicker-react/hooks'
import { SimpleGrid, Text } from '@chakra-ui/core'
import React from 'react'
import { UseMonthProps } from '@datepicker-react/hooks/lib/useMonth/useMonth'

interface DayValue {
  dayLabel: string
  date: Date
}

interface Props extends UseMonthProps {
  children: (days: DayValue[]) => React.ReactNode
}

export function Month({ children, ...props }: Props) {
  const { days, weekdayLabels } = useMonth({ ...props })

  return (
    <>
      <SimpleGrid
        columns={7}
        justifyContent="center">
        {weekdayLabels.map((dayLabel) => (
          <Text
            as="span"
            key={dayLabel}
            textAlign="center">
            {dayLabel}
          </Text>
        ))}
      </SimpleGrid>
      <SimpleGrid
        columns={7}
        justifyContent="center">
        {children(days as DayValue[])}
      </SimpleGrid>
    </>
  )
}
