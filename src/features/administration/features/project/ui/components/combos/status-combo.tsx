import { Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ComboField } from 'shared/components/FormFields/combo-field'
import { FC } from 'react'
import { ProjectStatus } from '../../../domain/project-status'
import { Status } from '../../../domain/status'

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
      value: true,
      name: 'OPEN'
    },
    {
      value: false,
      name: 'CLOSED'
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
