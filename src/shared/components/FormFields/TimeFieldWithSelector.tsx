import { Control } from 'react-hook-form'
import { ComboFieldCopy } from './ComboTimeField'
import { useMemo } from 'react'
import { timeOptions } from 'shared/utils/chrono'

interface Props {
  name: string
  label: string
  error?: string
  inputBgColor?: string
  control: Control<any>
  min?: string
  max?: string
}

export const TimeFieldWithSelector = (props: Props) => {
  const items = useMemo(() => {
    const min = props.min ? props.min : '00:00'
    const max = props.max ? props.max : '23:45'
    return timeOptions.slice(timeOptions.indexOf(min), timeOptions.indexOf(max) + 1)
  }, [props.min, props.max])

  return (
    <ComboFieldCopy
      control={props.control}
      name={props.name}
      label={props.label}
      items={items}
      isDisabled={false}
      isLoading={false}
    />
  )
}

TimeFieldWithSelector.displayName = 'TimeField'
