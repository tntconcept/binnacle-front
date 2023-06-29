import type { InputProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { useCallback } from 'react'
import FloatingLabelTimeCombobox from '../floating-label-combobox/floating-label-time-combobox'

interface Props extends InputProps {
  control: Control<any>
  name: string
  label: string
  items: any[]
  isLoading: boolean
  onChange?: (value: any) => void
  isDisabled: boolean
  inputStyle?: string
}

export const ComboTimeField = ({ onChange: onChangeProp, ...props }: Props) => {
  const { name, control, isDisabled, items, label, isLoading, inputStyle } = props
  const id = props.name + '_field'

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error }
  } = useController({
    name,
    control
  })

  const handleChangeCombobox = useCallback(
    (comboValue: any) => {
      onChange(comboValue)
      onChangeProp && onChangeProp(comboValue)
    },
    [onChangeProp, onChange]
  )

  return (
    <FormControl id={id} isInvalid={invalid && !isDisabled}>
      <FloatingLabelTimeCombobox
        name={name}
        onChange={handleChangeCombobox}
        onBlur={onBlur}
        value={value}
        ref={ref}
        items={items}
        label={label}
        isLoading={isLoading}
        isDisabled={isDisabled}
        data-testid={id}
        id={id}
        inputStyle={inputStyle}
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
}
