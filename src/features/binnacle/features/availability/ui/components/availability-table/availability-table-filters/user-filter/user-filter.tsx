import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useExecuteUseCaseOnMount } from '../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetUsersListQry } from '../../../../../../../../shared/user/application/get-users-list-qry'
import { UserInfo } from '../../../../../../../../shared/user/domain/user-info'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'

interface Props {
  onChange: (user: UserInfo) => void
}

export const UserFilter: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { control } = useForm()
  const { isLoading, result: users } = useExecuteUseCaseOnMount(GetUsersListQry, { active: true })

  const handleChange = (user: UserInfo) => {
    props.onChange(user)
  }

  const handleInputChange = (event: any) => {
    if (event.target.value.length > 3) {
      console.log(event.target.value)
    }
  }

  return (
    <ComboField
      data-testid="user-combo-field"
      name={'user-filter'}
      label={t('users_filter.user')}
      isLoading={isLoading}
      isDisabled={false}
      control={control}
      items={users ?? []}
      onInputChange={handleInputChange}
      onChange={handleChange}
    ></ComboField>
  )
}
