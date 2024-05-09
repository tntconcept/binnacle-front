import type { InputProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { FloatingLabelInput } from '../floating-label-input'

interface Props extends InputProps {
  label: string
  error?: string
}

export const MonthField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const id = props.name + '_field'

  return (
    <FormControl data-testid={id} id={id} isInvalid={props.error !== undefined}>
      <FloatingLabelInput type="month" placeholder="YYYY-MM" ref={ref} {...props} />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  )
})

MonthField.displayName = 'MonthField'
