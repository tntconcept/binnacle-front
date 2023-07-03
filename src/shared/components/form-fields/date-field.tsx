import type { InputProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { FloatingLabelInput } from 'shared/components/floating-label-input'

interface Props extends InputProps {
  label: string
  error?: string
}

export const DateField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const id = props.name + '_field'

  return (
    <FormControl id={id} isInvalid={props.error !== undefined}>
      <FloatingLabelInput type="date" ref={ref} {...props} />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  )
})

DateField.displayName = 'DateField'
