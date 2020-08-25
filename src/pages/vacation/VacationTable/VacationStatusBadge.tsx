import React from 'react'
import { PrivateHolidayState } from 'api/interfaces/IHolidays'
import { Badge } from '@chakra-ui/core'

export const VacationBadge: React.FC<{ state: PrivateHolidayState }> = ({
  state
}) => {
  if (state === PrivateHolidayState.Accept) {
    return <Badge colorScheme="green">Accept</Badge>
  }

  if (state === PrivateHolidayState.Pending) {
    return <Badge colorScheme="orange">Pending</Badge>
  }

  if (state === PrivateHolidayState.Cancelled) {
    return <Badge colorScheme="red">Cancelled</Badge>
  }

  return null
}
