import { useTranslation } from 'react-i18next'
import { FC, useEffect, useState } from 'react'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { useGetUseCase } from '../../../../../../../../../shared/arch/hooks/use-get-use-case'
import { GetProjectsQry } from '../../../../../../project/application/get-projects-qry'
import { Project } from '../../../../../../project/domain/project'
import { Organization } from '../../../../../../organization/domain/organization'
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
  }, [executeUseCase, organization])

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
