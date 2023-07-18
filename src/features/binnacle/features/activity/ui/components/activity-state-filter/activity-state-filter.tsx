import { Box, Flex, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const ActivityStateFilter = () => {
  const { t } = useTranslation()

  return (
    <Flex as="form">
      <Box>
        <Select defaultValue="pending">
          <option value="pending">{t('activity.pending_state')}</option>
          <option value="accepted">{t('activity.accepted_state')}</option>
          <option value="all">All</option>
        </Select>
      </Box>
    </Flex>
  )
}
