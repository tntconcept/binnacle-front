import { Badge } from '@chakra-ui/react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const StatusBadge: FC<{ status: boolean }> = ({ status }) => {
  const { t } = useTranslation()

  if (status) {
    return <Badge colorScheme="green">{t('projects.open')}</Badge>
  }

  if (!status) {
    return <Badge colorScheme="red">{t('projects.closed')}</Badge>
  }

  return null
}
