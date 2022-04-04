import type { InputProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import FloatingLabelCombobox from 'shared/components/FloatingLabelCombobox/FloatingLabelCombobox'
import { useCallback } from 'react'

interface Props extends InputProps {
  control: Control<ActivityFormSchema>
  name: string
  label: string
  items: any[]
  isLoading: boolean
  onChange?: (value: any) => void
  isDisabled: boolean
}

export const ComboField = ({ onChange: onChangeProp, ...props }: Props) => {
  const id = props.name + '_field'

  const {
    field: { onChange, onBlur, value, ref, name },
    fieldState: { invalid, error }
  } = useController({
    name: props.name as any
  })

  const handleChangeCombobox = useCallback(
    (comboValue: any) => {
      onChange(comboValue)
      onChangeProp && onChangeProp(comboValue)
    },
    [onChangeProp, onChange]
  )

  return (
    <FormControl id={id} isInvalid={invalid && !props.isDisabled}>
      <FloatingLabelCombobox
        name={name}
        onChange={handleChangeCombobox}
        onBlur={onBlur}
        value={value}
        ref={ref}
        items={props.items}
        label={props.label}
        isLoading={props.isLoading}
        isDisabled={props.isDisabled}
        data-testid={id}
        id={id}
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
}
