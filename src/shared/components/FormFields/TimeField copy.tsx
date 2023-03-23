import { Control } from 'react-hook-form'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { ComboFieldCopy } from './ComboField copy'
import { useMemo } from 'react'
import { timeOptions } from 'shared/utils/chrono'

interface Props {
  name: string
  label: string
  error?: string
  inputBgColor?: string
  control: Control<ActivityFormSchema>
  min: string
  max: string
}

export const TimeFieldCopy = (props: Props) => {
  const items = useMemo(() => {
    return timeOptions.slice(timeOptions.indexOf(props.min), timeOptions.indexOf(props.max) + 1)
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

TimeFieldCopy.displayName = 'TimeField'
