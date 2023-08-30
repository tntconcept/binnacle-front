import { forwardRef, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../../shared/arch/hooks/use-get-use-case'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { Organization } from '../../../../../../organization/domain/organization'
import { GetProjectsQry } from '../../../../../../project/application/get-projects-qry'
import { Project } from '../../../../../../project/domain/project'

interface ComboProps {
  name?: string
  isDisabled: boolean
  organization?: Organization
  control: Control<any>
  onChange?: (item: Project) => void
}

export const ProjectsCombo = forwardRef<HTMLInputElement, ComboProps>((props, ref) => {
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
      ref={ref}
      control={control}
      name={name}
      label={t('activity_form.project')}
      items={items}
      onChange={onChange}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  )
})

ProjectsCombo.displayName = 'ProjectsCombo'
