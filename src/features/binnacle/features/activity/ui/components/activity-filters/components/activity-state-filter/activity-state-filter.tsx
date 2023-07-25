import { Box, FormLabel } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { ActivityApprovalStateFilter } from '../../../../../domain/activity-approval-state-filter'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { useForm } from 'react-hook-form'

interface Props {
  onChange: (state: ActivityApprovalStateFilter) => void
  defaultValue: string
}

interface Item {
  id: ActivityApprovalStateFilter
  name: string
}

export const ActivityStateFilter: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { control } = useForm()

  const handleChange = (item?: Item) => {
    props.onChange(item?.id ?? 'ALL')
  }

  const items: Item[] = [
    {
      id: 'PENDING',
      name: t('activity_state_filter.pending_state')
    },
    {
      id: 'ACCEPTED',
      name: t('activity_state_filter.accepted_state')
    },
    {
      id: 'ALL',
      name: t('activity_state_filter.all')
    }
  ]

  return (
    <Box>
      <FormLabel>{t('activity_state_filter.select_state')}</FormLabel>
      <ComboField
        name={'activity-state-filter'}
        data-testid="activity_state_filter"
        defaultValue={props.defaultValue}
        onChange={handleChange}
        label={''}
        items={items}
        control={control}
      ></ComboField>
    </Box>
  )
}
