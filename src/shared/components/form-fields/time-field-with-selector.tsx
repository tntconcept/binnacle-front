import { Control } from 'react-hook-form'
import { ComboTimeField } from './combo-time-field'
import { useMemo } from 'react'
import { timeOptions } from '../../utils/chrono'

interface Props {
  name: string
  label: string
  control: Control<any>
  min?: string
  max?: string
  isReadOnly?: boolean
}

export const TimeFieldWithSelector = (props: Props) => {
  const { min, max, label, name, control, isReadOnly } = props
  const items = useMemo(() => {
    const minValue = min ? min : '00:00'
    const maxValue = max ? max : '23:45'
    return timeOptions.slice(timeOptions.indexOf(minValue), timeOptions.indexOf(maxValue) + 1)
  }, [min, max])

  return (
    <ComboTimeField
      control={control}
      name={name}
      label={label}
      items={items}
      isDisabled={isReadOnly === true}
      isLoading={false}
      inputStyle={'time'}
    />
  )
}

TimeFieldWithSelector.displayName = 'TimeFieldWithSelector'
