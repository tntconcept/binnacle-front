import type { TextareaProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { FloatingLabelTextarea } from '../floating-label-textarea'

interface Props extends TextareaProps {
  label: string
  error?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(({ ...props }, ref) => {
  const id = props.name + '_field'

  return (
    <FormControl id={id} isInvalid={props.error !== undefined}>
      <FloatingLabelTextarea ref={ref} {...props} />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  )
})

TextAreaField.displayName = 'TextAreaField'
