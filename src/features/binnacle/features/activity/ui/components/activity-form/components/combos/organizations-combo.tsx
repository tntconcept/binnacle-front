import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComboField } from 'shared/components/FormFields/ComboField'
import { ActivityFormSchema } from '../../activity-form.schema'
import { GetOrganizationsQry } from 'features/binnacle/features/organization/application/get-organizations-qry'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'

interface ComboProps {
  onChange: (item: any) => void
  control: Control<ActivityFormSchema>
}

export const OrganizationsCombo = (props: ComboProps) => {
  const { t } = useTranslation()
  const { isLoading, result: organizations } = useExecuteUseCaseOnMount(GetOrganizationsQry)

  return (
    <ComboField
      control={props.control}
      name="organization"
      label={t('activity_form.organization')}
      items={organizations ?? []}
      onChange={props.onChange}
      isDisabled={false}
      isLoading={isLoading}
    />
  )
}
