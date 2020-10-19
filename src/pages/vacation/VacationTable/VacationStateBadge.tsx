import React from 'react'
import { VacationState } from 'api/interfaces/IHolidays'
import { Badge } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'

export const VacationBadge: React.FC<{ state: VacationState }> = ({ state }) => {
  const { t } = useTranslation()

  if (state === VacationState.Accept) {
    return <Badge colorScheme="green">{t('vacation_table.state_accept')}</Badge>
  }

  if (state === VacationState.Pending) {
    return <Badge colorScheme="orange">{t('vacation_table.state_pending')}</Badge>
  }

  if (state === VacationState.Cancelled) {
    return <Badge colorScheme="red">{t('vacation_table.state_canceled')}</Badge>
  }

  if (state === VacationState.Reject) {
    return <Badge colorScheme="red">{t('vacation_table.state_reject')}</Badge>
  }

  return null
}
