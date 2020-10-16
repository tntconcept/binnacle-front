import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/core'

interface Props extends React.InputHTMLAttributes<Omit<HTMLInputElement, 'size'>> {}

export const PasswordInput: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow((prevState) => !prevState)

  return (
    <InputGroup size="md">
      <Input pr="4.5rem" type={show ? 'text' : 'password'} {...(props as any)} />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={handleClick}
          data-testid="password_visibility_button"
        >
          {show ? t('actions.hide') : t('actions.show')}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
