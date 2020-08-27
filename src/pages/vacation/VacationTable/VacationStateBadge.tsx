import React from 'react'
import { PrivateHolidayState } from 'api/interfaces/IHolidays'
import { Badge } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'

export const VacationBadge: React.FC<{ state: PrivateHolidayState }> = ({
  state
}) => {
  const { t } = useTranslation()

  if (state === PrivateHolidayState.Accept) {
    return <Badge colorScheme="green">{t('vacation_table.state_accept')}</Badge>
  }

  if (state === PrivateHolidayState.Pending) {
    return <Badge colorScheme="orange">{t('vacation_table.state_pending')}</Badge>
  }

  if (state === PrivateHolidayState.Cancelled) {
    return <Badge colorScheme="red">{t('vacation_table.state_canceled')}</Badge>
  }

  return null
}
