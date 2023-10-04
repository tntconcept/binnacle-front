import type { InputProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage, useMergeRefs } from '@chakra-ui/react'
import type { Control } from 'react-hook-form'
import { useController, useWatch } from 'react-hook-form'
import { FloatingLabelComboboxOptions } from '../floating-label-combobox/floating-label-combobox-options'
import { forwardRef, useCallback } from 'react'

interface Props extends InputProps {
  control: Control<any>
  name: string
  label: string
  items: any[]
  isLoading: boolean
  onChange?: (value: any) => void
  onInputChange?: (value: any) => void
  isDisabled: boolean
}

export const ComboField = forwardRef<HTMLInputElement, Props>(
  ({ onChange: onChangeProp, ...props }: Props, ref) => {
    const id = props.name + '_field'

    const {
      field: { onChange, onBlur, ref: controllerRef, name },
      fieldState: { invalid, error }
    } = useController({
      name: props.name,
      control: props.control
    })

    const mergedRefs = useMergeRefs(ref, controllerRef)

    const value = useWatch({
      control: props.control,
      name: props.name
    })

    const handleChangeCombobox = useCallback(
      (comboValue: any) => {
        onChange(comboValue)
        onChangeProp?.(comboValue)
      },
      [onChangeProp, onChange]
    )

    return (
      <FormControl id={id} isInvalid={invalid && !props.isDisabled}>
        <FloatingLabelComboboxOptions
          name={name}
          onChange={handleChangeCombobox}
          onInput={props.onInputChange}
          onBlur={onBlur}
          value={value}
          ref={mergedRefs}
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
)

ComboField.displayName = 'ComboField'
