import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { GetOrganizationsQry } from '../../../../../../organization/application/get-organizations-qry'
import { useExecuteUseCaseOnMount } from '../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { Organization } from '../../../../../../organization/domain/organization'
import { forwardRef } from 'react'

interface Props {
  name?: string
  control: Control<any>
  onChange?: (item: Organization) => void
  isReadOnly?: boolean
}

export const OrganizationsCombo = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { name = 'organization', control, onChange, isReadOnly } = props
  const { t } = useTranslation()
  const { isLoading, result: organizations } = useExecuteUseCaseOnMount(GetOrganizationsQry)

  return (
    <ComboField
      ref={ref}
      control={control}
      name={name}
      label={t('activity_form.organization')}
      items={organizations ?? []}
      onChange={onChange}
      isDisabled={isReadOnly === true}
      isLoading={isLoading}
    />
  )
})

OrganizationsCombo.displayName = 'OrganizationsCombo'
