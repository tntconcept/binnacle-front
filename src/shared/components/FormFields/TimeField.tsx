import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { FloatingLabelInput } from 'shared/components/FloatingLabelInput'

interface Props {
  name: string
  label: string
  error?: string
  inputBgColor?: string
}

export const TimeField = forwardRef<HTMLInputElement, Props>(
  ({ label, inputBgColor, ...props }, ref) => {
    return (
      <FormControl id={`${props.name}_field`} isInvalid={props.error !== undefined}>
        <FloatingLabelInput
          label={label}
          inputBgColor={inputBgColor}
          type="time"
          step="900"
          min="00:00"
          max="23:59"
          ref={ref}
          {...props}
        />
        <FormErrorMessage>{props.error}</FormErrorMessage>
      </FormControl>
    )
  }
)
