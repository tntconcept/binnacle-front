import { useTranslation } from 'react-i18next'
import { Control, useWatch } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import { container } from 'tsyringe'
import { CombosRepository } from 'modules/binnacle/data-access/repositories/combos-repository'
import { ComboField } from 'shared/components/FormFields/ComboField'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'

interface ComboProps {
  onChange: (item: any) => void
  isDisabled: boolean
  control: Control<ActivityFormSchema>
}

export const ProjectRolesCombo = (props: ComboProps) => {
  const { t } = useTranslation()

  const project = useWatch({
    control: props.control,
    name: 'project'
  })

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ProjectRole[]>([])

  useEffect(() => {
    const combosRepo = container.resolve(CombosRepository)

    if (project?.id) {
      setLoading(true)
      combosRepo
        .getProjectRoles(project.id)
        .then((roles) => {
          setItems(roles)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [project])

  return (
    <ComboField
      control={props.control}
      name="role"
      label={t('activity_form.role')}
      items={items}
      isDisabled={props.isDisabled}
      isLoading={loading}
      onChange={props.onChange}
    />
  )
}
