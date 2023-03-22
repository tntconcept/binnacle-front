import { Control } from 'react-hook-form'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'

import { ComboFieldCopy } from './ComboField copy'

interface Props {
  label: string
  error?: string
  inputBgColor?: string
  control: Control<ActivityFormSchema>
  min: string
  max: string
}

//Hora minima

export const TimeFieldCopy = (props: Props) => {
  const minHour = parseInt(props.min.split(':')[0])
  const minMin = parseInt(props.min.split(':')[1])
  const maxHour = parseInt(props.max.split(':')[0])
  const maxMin = parseInt(props.max.split(':')[1])
  const items = []
  for (let i = minHour; i <= maxHour; i++) {
    for (let j = minMin / 15; j <= maxMin / 15; j++) {
      const auxMin = i <= 9 ? '0' + i : i
      const auxMax = j == 0 ? '00' : j * 15
      const aux = String(auxMin + ':' + auxMax)
      items.push(aux)
    }
  }
  return (
    <ComboFieldCopy
      control={props.control}
      name="startTime"
      label={props.label}
      items={items}
      isDisabled={false}
      isLoading={false}
      min={props.min}
      max={props.max}
    />
  )
}

TimeFieldCopy.displayName = 'TimeField'
