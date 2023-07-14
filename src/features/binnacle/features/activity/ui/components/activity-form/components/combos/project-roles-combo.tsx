import { useTranslation } from 'react-i18next'
import { Control } from 'react-hook-form'
import { FC, useEffect, useState } from 'react'
import { ComboField } from '../../../../../../../../../shared/components/form-fields/combo-field'
import { useGetUseCase } from '../../../../../../../../../shared/arch/hooks/use-get-use-case'
import { GetProjectRolesQry } from '../../../../../../project-role/application/get-project-roles-qry'
import { NonHydratedProjectRole } from '../../../../../../project-role/domain/non-hydrated-project-role'
import { Project } from '../../../../../../project/domain/project'
import { ProjectRole } from '../../../../../../project-role/domain/project-role'
import { useCalendarContext } from '../../../../contexts/calendar-context'

interface ComboProps {
  name?: string
  isDisabled: boolean
  control: Control<any>
  project?: Project
  onChange?: (projectRole: ProjectRole) => void
}

export const ProjectRolesCombo: FC<ComboProps> = (props) => {
  const { name = 'projectRole', control, isDisabled, project, onChange = () => {} } = props
  const { t } = useTranslation()
  const { selectedDate } = useCalendarContext()

  const { isLoading, executeUseCase } = useGetUseCase(GetProjectRolesQry)

  const [items, setItems] = useState<NonHydratedProjectRole[]>([])

  useEffect(() => {
    if (project) {
      executeUseCase({ projectId: project.id, year: selectedDate.getFullYear() }).then((roles) => {
        setItems(roles)
      })
    }
  }, [project])

  return (
    <ComboField
      control={control}
      name={name}
      label={t('activity_form.role')}
      items={items}
      isDisabled={isDisabled}
      isLoading={isLoading}
      onChange={onChange}
    />
  )
}
