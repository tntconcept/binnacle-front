import type { TextareaProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage, useColorModeValue } from '@chakra-ui/react'
import type { Ref } from 'react'
import { forwardRef } from 'react'
import { FloatingLabelTextarea } from 'shared/components/floating-label-textarea'

interface Props extends TextareaProps {
  label: string
  error?: string
  labelBgColorDarkTheme?: string
}

function TextAreaField({ labelBgColorDarkTheme, ...props }: Props, ref: Ref<HTMLTextAreaElement>) {
  const labelBg = useColorModeValue('white', labelBgColorDarkTheme ?? 'gray.800')
  const id = props.name + '_field'

  return (
    <FormControl id={id} isInvalid={props.error !== undefined}>
      <FloatingLabelTextarea labelBgColor={labelBg} ref={ref} {...props} />
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  )
}

export default forwardRef(TextAreaField)
