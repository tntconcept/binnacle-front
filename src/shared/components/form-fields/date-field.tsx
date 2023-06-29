import type { InputProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import type { Ref } from 'react'
import { forwardRef } from 'react'
import { FloatingLabelInput } from 'shared/components/floating-label-input'

interface Props extends InputProps {
  label: string
  error?: string
}

function DateField(props: Props, ref: Ref<HTMLInputElement>) {
  const id = props.name + '_field'

  return (
    <FormControl id={id} isInvalid={props.error !== undefined}>
      <FloatingLabelInput type="date" ref={ref} {...props} />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  )
}

export default forwardRef(DateField)
