import { useForm } from 'react-hook-form'
import { FC } from 'react'
import { Box, FormLabel } from '@chakra-ui/react'
import { UserInfo } from '../../../../../../../../shared/user/domain/user-info'
import { useExecuteUseCaseOnMount } from '../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetUsersListQry } from '../../../../../../../../shared/user/application/get-users-list-qry'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange: (user: UserInfo) => void
}

export const ActivityUserFilter: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { control } = useForm()
  const { isLoading, result: users } = useExecuteUseCaseOnMount(GetUsersListQry, { active: true })

  const handleChange = (user: UserInfo) => {
    props.onChange(user)
  }

  return (
    <Box>
      <FormLabel>{t('activity_state_filter.select_user')}</FormLabel>
      <ComboField
        data-testid="user-combo-field"
        name={'user-filter'}
        label={''}
        isLoading={isLoading}
        isDisabled={false}
        control={control}
        items={users ?? []}
        onChange={handleChange}
      ></ComboField>
    </Box>
  )
}
