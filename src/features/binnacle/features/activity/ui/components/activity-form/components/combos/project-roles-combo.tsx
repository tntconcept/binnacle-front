import { forwardRef, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../../../shared/arch/hooks/use-get-use-case'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { Id } from '../../../../../../../../../shared/types/id'
import { GetProjectRolesQry } from '../../../../../../project-role/application/get-project-roles-qry'
import { NonHydratedProjectRole } from '../../../../../../project-role/domain/non-hydrated-project-role'
import { ProjectRole } from '../../../../../../project-role/domain/project-role'
import { Project } from '../../../../../../project/domain/project'
import { useCalendarContext } from '../../../../contexts/calendar-context'

interface ComboProps {
  name?: string
  isDisabled: boolean
  control: Control<any>
  project?: Project
  userId?: Id
  onChange?: (projectRole: ProjectRole) => void
}

export const ProjectRolesCombo = forwardRef<HTMLInputElement, ComboProps>((props, ref) => {
  const { name = 'projectRole', control, isDisabled, project, onChange = () => {} } = props
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()

  const { isLoading, executeUseCase } = useGetUseCase(GetProjectRolesQry)

  const [items, setItems] = useState<NonHydratedProjectRole[]>([])

  useEffect(() => {
    if (!project?.id) {
      setItems([])
      return
    }

    executeUseCase({
      projectId: project.id,
      year: selectedDate.getFullYear(),
      userId: props.userId
    }).then((roles) => {
      setItems(roles)
    })
  }, [project?.id, executeUseCase, selectedDate])

  return (
    <ComboField
      ref={ref}
      control={control}
      name={name}
      label={t('activity_form.role')}
      items={items}
      isDisabled={isDisabled}
      isLoading={isLoading}
      onChange={onChange}
    />
  )
})

ProjectRolesCombo.displayName = 'ProjectRolesCombo'
