import { Box, FormLabel, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC } from 'react'
import { ActivityApprovalStateFilter } from '../../../../../domain/activity-approval-state-filter'

interface Props {
  onChange: (state: ActivityApprovalStateFilter) => void
  defaultValue: string
}

export const ActivityStateFilter: FC<Props> = (props) => {
  const { t } = useTranslation()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value as ActivityApprovalStateFilter
    props.onChange(optionSelected)
  }

  return (
    <Box>
      <FormLabel>{t('activity_state_filter.select_state')}</FormLabel>
      <Select
        height={47}
        borderRadius={4}
        data-testid="activity_state_filter"
        defaultValue={props.defaultValue}
        onChange={handleChange}
      >
        <option value="PENDING">{t('activity_state_filter.pending_state')}</option>
        <option value="ACCEPTED">{t('activity_state_filter.accepted_state')}</option>
        <option value="ALL">{t('activity_state_filter.all')}</option>
      </Select>
    </Box>
  )
}
