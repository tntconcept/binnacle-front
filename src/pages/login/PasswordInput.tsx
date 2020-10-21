import React from 'react'
import { useTranslation } from 'react-i18next'
import { InputGroup, InputRightElement, Icon, IconButton } from '@chakra-ui/core'
import { ReactComponent as EyeIcon } from 'heroicons/outline/eye.svg'
import { ReactComponent as EyeOffIcon } from 'heroicons/outline/eye-off.svg'
import { FloatingLabelInput } from 'core/components/FloatingLabelInput'

interface Props extends React.InputHTMLAttributes<Omit<HTMLInputElement, 'size'>> {
  label: string
  labelBgColor: string
}

export const PasswordInput: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow((prevState) => !prevState)

  return (
    <InputGroup size="md">
      <FloatingLabelInput pr="4.5rem" type={show ? 'text' : 'password'} {...(props as any)} />
      <InputRightElement width="4.5rem" h="full">
        <IconButton
          aria-label={show ? t('actions.hide') : t('actions.show')}
          icon={show ? <Icon as={EyeOffIcon} boxSize={5} /> : <Icon as={EyeIcon} boxSize={5} />}
          onClick={handleClick}
          variant="ghost"
          size="sm"
          data-testid="password_visibility_button"
        />
      </InputRightElement>
    </InputGroup>
  )
}
