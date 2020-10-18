import React from 'react'
import { useTitle } from 'core/hooks'
import { LoginForm } from 'pages/login/LoginForm'
import { Flex, Text } from '@chakra-ui/core'

const LoginPage: React.FC = () => {
  useTitle('Login')

  return (
    <Flex direction="column" height="100%">
      <LoginForm />
      <Text p={2} alignSelf="flex-end">
        v{process.env.REACT_APP_VERSION}
      </Text>
    </Flex>
  )
}

export default LoginPage
