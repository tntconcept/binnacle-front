import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetUsersListQry } from '../../../../../../shared/user/application/get-users-list-qry'
import { ComboField } from '../../../../../../../shared/components/form-fields/combo-field'
import { useForm } from 'react-hook-form'
import { UserInfo } from '../../../../../../shared/user/domain/user-info'
import { FC } from 'react'

export const ActivityUserFilter: FC<{ onChange: (user: UserInfo) => void }> = (props) => {
  const { control } = useForm()
  const { isLoading, result: users } = useExecuteUseCaseOnMount(GetUsersListQry)

  return (
    <ComboField
      name={'user-filter'}
      label={''}
      isLoading={isLoading}
      isDisabled={false}
      control={control}
      items={users ?? []}
      onChange={props.onChange}
    ></ComboField>
  )
}
