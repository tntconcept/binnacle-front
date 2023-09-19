import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComboField } from '../../../../../../../shared/components/form-fields/combo-field'
import { FC } from 'react'
import { Status } from '../../../../../../shared/project/domain/status'
import { ProjectStatus } from '../../../../../../shared/project/domain/project-status'

interface ComboProps {
  name?: string
  control: Control<any>
  onChange?: (item: Status) => void
}

export const StatusCombo: FC<ComboProps> = (props) => {
  const { name = 'status', control, onChange } = props
  const { t } = useTranslation()
  const status: ProjectStatus[] = [
    {
      id: 1,
      value: true,
      name: t('projects.open')
    },
    {
      id: 2,
      value: false,
      name: t('projects.closed')
    }
  ]

  return (
    <ComboField
      control={control}
      name={name}
      label={t('projects_filter.status')}
      items={status}
      onChange={onChange}
      isDisabled={false}
      isLoading={false}
    />
  )
}
