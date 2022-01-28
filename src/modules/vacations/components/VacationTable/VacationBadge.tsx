import { Badge } from '@chakra-ui/react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { VacationStatus } from 'shared/types/Vacation'

export const VacationBadge: FC<{ status: VacationStatus }> = ({ status }) => {
  const { t } = useTranslation()

  if (status === 'ACCEPT') {
    return <Badge colorScheme="green">{t('vacation_table.state_accept')}</Badge>
  }

  if (status === 'PENDING') {
    return <Badge colorScheme="orange">{t('vacation_table.state_pending')}</Badge>
  }

  if (status === 'CANCELLED') {
    return <Badge colorScheme="red">{t('vacation_table.state_canceled')}</Badge>
  }

  if (status === 'REJECT') {
    return <Badge colorScheme="red">{t('vacation_table.state_reject')}</Badge>
  }

  return null
}
