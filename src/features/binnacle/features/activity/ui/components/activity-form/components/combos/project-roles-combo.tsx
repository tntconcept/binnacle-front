import { useTranslation } from 'react-i18next'
import { Control, useWatch } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ComboField } from 'shared/components/FormFields/ComboField'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { GetProjectRolesQry } from 'features/binnacle/features/project-role/application/get-project-roles-qry'
import { ActivityFormSchema } from '../../activity-form.schema'
import { NonHydratedProjectRole } from 'features/binnacle/features/project-role/domain/non-hydrated-project-role'

interface ComboProps {
  isDisabled: boolean
  control: Control<ActivityFormSchema>
}

export const ProjectRolesCombo = (props: ComboProps) => {
  const { t } = useTranslation()

  const project = useWatch({
    control: props.control,
    name: 'project'
  })

  const { isLoading, executeUseCase } = useGetUseCase(GetProjectRolesQry)

  const [items, setItems] = useState<NonHydratedProjectRole[]>([])

  useEffect(() => {
    if (project?.id) {
      executeUseCase(project.id).then((roles) => {
        setItems(roles)
      })
    }
  }, [project])

  return (
    <ComboField
      control={props.control}
      name="role"
      label={t('activity_form.role')}
      items={items}
      isDisabled={props.isDisabled}
      isLoading={isLoading}
    />
  )
}
