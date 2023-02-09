import { Flex, Heading, useColorModeValue } from '@chakra-ui/react'
import { AppVersion } from 'modules/login/components/AppVersion'
import { useTranslation } from 'react-i18next'
import { LogoAutentia } from 'shared/components/LogoAutentia'
import { SignInWithGoogleButton } from '../SignInWithGoogle/SignInWithGoogleButton'

export const LoginForm = () => {
  const { t } = useTranslation()

  const bgColor = useColorModeValue('white', undefined)

  return (
    <Flex direction="column" height="100%" bgColor={bgColor}>
      <Flex direction="column" m="auto" minWidth="300px">
        <LogoAutentia size="lg" />
        <Heading as="h1" size="xl">
          {t('login_page.welcome_title')}
        </Heading>
        <Heading as="h2" size="md" mt={2} mb={8}>
          {t('login_page.welcome_message')}
        </Heading>
        <SignInWithGoogleButton />
      </Flex>
      <AppVersion />
    </Flex>
  )
}
