import { useTranslation } from 'react-i18next'
import { FC, useEffect, useState } from 'react'
import { ComboField } from 'shared/components/FormFields/combo-field'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { GetProjectsQry } from 'features/binnacle/features/project/application/get-projects-qry'
import { Project } from 'features/binnacle/features/project/domain/project'
import { Organization } from 'features/binnacle/features/organization/domain/organization'
import { Control } from 'react-hook-form'

interface ComboProps {
  name?: string
  isDisabled: boolean
  organization?: Organization
  control: Control<any>
  onChange?: (item: Project) => void
}

export const ProjectsCombo: FC<ComboProps> = (props) => {
  const { name = 'project', organization, control, isDisabled, onChange } = props
  const { t } = useTranslation()

  const [items, setItems] = useState<Project[]>([])
  const { isLoading, executeUseCase } = useGetUseCase(GetProjectsQry)

  useEffect(() => {
    if (organization) {
      executeUseCase(organization.id).then((projects) => {
        setItems(projects)
      })
    }
  }, [organization])

  return (
    <ComboField
      control={control}
      name={name}
      label={t('activity_form.project')}
      items={items}
      onChange={onChange}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  )
}
