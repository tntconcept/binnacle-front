import { forwardRef, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../../shared/arch/hooks/use-get-use-case'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { Project } from '../../../../../../../../shared/project/domain/project'
import { GetProjectsQry } from '../../../../../../../../shared/project/application/binnacle/get-projects-qry'
import { ProjectOrganizationFilters } from '../../../../../../../../shared/project/domain/project-organization-filters'

interface ComboProps {
  name?: string
  isDisabled: boolean
  control: Control<any>
  onChange?: (item: Project) => void
  projectOrganizationFilters: ProjectOrganizationFilters
}

export const ProjectsCombo = forwardRef<HTMLInputElement, ComboProps>((props, ref) => {
  const { name = 'project', control, isDisabled, projectOrganizationFilters, onChange } = props
  const { t } = useTranslation()

  const [items, setItems] = useState<Project[]>([])
  const { isLoading, executeUseCase } = useGetUseCase(GetProjectsQry)

  useEffect(() => {
    if (
      !projectOrganizationFilters.organizationIds ||
      projectOrganizationFilters.organizationIds.length === 0
    ) {
      setItems([])
      return
    }

    executeUseCase(projectOrganizationFilters).then((projects) => {
      setItems(projects)
    })
  }, [executeUseCase, projectOrganizationFilters])

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
