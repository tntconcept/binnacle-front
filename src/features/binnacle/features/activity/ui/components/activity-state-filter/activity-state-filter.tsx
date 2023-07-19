import { Box, Flex, FormLabel, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC } from 'react'
import { ActivityApprovalStateFilter } from '../../../domain/activity-approval-state-filter'

export const ActivityStateFilter: FC<{
  onChange: (state: ActivityApprovalStateFilter) => void
  defaultValue: string
}> = (props) => {
  const { t } = useTranslation()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value as ActivityApprovalStateFilter
    props.onChange(optionSelected)
  }

  return (
    <Flex as="form" marginBottom={5}>
      <Box>
        <FormLabel>{t('activity.select_state')}</FormLabel>
        <Select data-testid="select" defaultValue={props.defaultValue} onChange={handleChange}>
          <option value="PENDING">{t('activity.pending_state')}</option>
          <option value="ACCEPTED">{t('activity.accepted_state')}</option>
          <option value="ALL">{t('activity.all')}</option>
        </Select>
      </Box>
    </Flex>
  )
}
