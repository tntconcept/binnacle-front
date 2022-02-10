import type { SwitchProps } from "@chakra-ui/react";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { forwardRef } from "react";

interface Props extends SwitchProps {
  label: string
}

export const SwitchField = forwardRef<HTMLInputElement, Props>(({ label, ...props }, ref) => {
  const id = props.name + '_field'

  return (
    <FormControl display="flex" alignItems="center">
      <Switch id={id} {...props} ref={ref} mr={2} colorScheme="brand" />
      <FormLabel htmlFor={id} mb={0}>
        {label}
      </FormLabel>
    </FormControl>
  )
})

SwitchField.displayName = 'SwitchField'
