import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ComboField } from 'shared/components/FormFields/ComboField'
import { ActivityFormSchema } from '../../activity-form.schema'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { GetProjectsQry } from 'features/binnacle/features/project/application/get-projects-qry'
import { Project } from 'features/binnacle/features/project/domain/project'

interface ComboProps {
  onChange: (item: any) => void
  isDisabled: boolean
  control: Control<ActivityFormSchema>
}

export const ProjectsCombo = (props: ComboProps) => {
  const { t } = useTranslation()

  const organization = useWatch({
    control: props.control,
    name: 'organization'
  })

  const [items, setItems] = useState<Project[]>([])

  const { isLoading, executeUseCase } = useGetUseCase(GetProjectsQry)

  useEffect(() => {
    if (organization?.id) {
      executeUseCase(organization.id).then((projects) => {
        setItems(projects)
      })
    }
  }, [organization])

  return (
    <ComboField
      control={props.control}
      name="project"
      label={t('activity_form.project')}
      items={items}
      onChange={props.onChange}
      isDisabled={props.isDisabled}
      isLoading={isLoading}
    />
  )
}
