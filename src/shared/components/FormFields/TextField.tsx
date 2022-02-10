import type { InputProps } from "@chakra-ui/react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { forwardRef } from "react";
import { FloatingLabelInput } from "shared/components/FloatingLabelInput";

interface Props extends InputProps {
  name: string
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, Props>(({ label, error, ...props }, ref) => {
  const id = props.name + "_field";

  return (
    <FormControl id={id} isInvalid={error !== undefined}>
      <FloatingLabelInput label={label} data-testid={id} ref={ref} {...props} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
})

TextField.displayName = 'TextField'
