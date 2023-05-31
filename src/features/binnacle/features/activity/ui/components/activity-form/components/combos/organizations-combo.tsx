import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComboField } from 'shared/components/FormFields/combo-field'
import { GetOrganizationsQry } from 'features/binnacle/features/organization/application/get-organizations-qry'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { Organization } from 'features/binnacle/features/organization/domain/organization'
import { FC } from 'react'

interface ComboProps {
  name?: string
  control: Control<any>
  onChange?: (item: Organization) => void
}

export const OrganizationsCombo: FC<ComboProps> = (props) => {
  const { name = 'organization', control, onChange } = props
  const { t } = useTranslation()
  const { isLoading, result: organizations } = useExecuteUseCaseOnMount(GetOrganizationsQry)

  return (
    <ComboField
      control={control}
      name={name}
      label={t('activity_form.organization')}
      items={organizations ?? []}
      onChange={onChange}
      isDisabled={false}
      isLoading={isLoading}
    />
  )
}
