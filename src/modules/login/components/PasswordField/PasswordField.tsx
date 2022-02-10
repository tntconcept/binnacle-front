import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { PasswordInput } from "modules/login/components/PasswordField/PasswordInput";
import type { FC } from "react";
import { forwardRef } from "react";

interface Props {
  name: string
  label: string
  error?: string
}

export const PasswordField: FC<Props> = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    const id = props.name + "_field";

    return (
      <FormControl id={id} isInvalid={error !== undefined}>
        <PasswordInput
          label={label}
          autoComplete="current-password"
          data-testid={id}
          ref={ref}
          {...props}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    )
  }
)

PasswordField.displayName = 'PasswordField'
