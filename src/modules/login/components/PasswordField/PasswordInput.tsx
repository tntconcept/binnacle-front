import { Icon, IconButton, InputGroup, InputRightElement } from "@chakra-ui/react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FloatingLabelInput } from "shared/components/FloatingLabelInput";

interface Props extends InputHTMLAttributes<Omit<HTMLInputElement, 'size'>> {
  label: string
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const handleShowPassword = () => setShow((prevState) => !prevState)

  return (
    <InputGroup size="md">
      <FloatingLabelInput
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        {...(props as any)}
        ref={ref}
      />
      <InputRightElement width="4.5rem" h="full">
        <IconButton
          aria-label={show ? t('actions.hide') : t('actions.show')}
          icon={show ? <Icon as={EyeOffIcon} boxSize={5} /> : <Icon as={EyeIcon} boxSize={5} />}
          onClick={handleShowPassword}
          variant="ghost"
          size="sm"
          data-testid="password_visibility_button"
        />
      </InputRightElement>
    </InputGroup>
  )
})

PasswordInput.displayName = 'PasswordInput'
