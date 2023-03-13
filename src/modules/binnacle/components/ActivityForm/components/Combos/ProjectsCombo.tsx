import { Control, useWatch } from 'react-hook-form'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Project } from 'modules/binnacle/data-access/interfaces/project.interface'
import { container } from 'tsyringe'
import { CombosRepository } from 'modules/binnacle/data-access/interfaces/combos-repository'
import { ComboField } from 'shared/components/FormFields/ComboField'
import { COMBOS_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

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

  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Project[]>([])

  useEffect(() => {
    const combosRepo = container.resolve<CombosRepository>(COMBOS_REPOSITORY)

    if (organization?.id) {
      setLoading(true)
      combosRepo
        .getProjects(organization.id)
        .then((projects) => {
          setItems(projects)
          setLoading(false)
        })
        .catch(() => setLoading(false))
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
      isLoading={loading}
    />
  )
}
