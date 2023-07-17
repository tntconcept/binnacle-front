import { Flex, Heading, useColorModeValue } from '@chakra-ui/react'
import { AppVersion } from '../../../../version/ui/components/app-version'
import { useTranslation } from 'react-i18next'
import { Logo } from '../../../../../shared/components/logo'
import { SignInWithGoogleButton } from '../sign-in-with-google/sign-in-with-google-button'
import { FC } from 'react'

export const LoginForm: FC = () => {
  const { t } = useTranslation()

  const bgColor = useColorModeValue('white', undefined)

  return (
    <Flex direction="column" height="100%" bgColor={bgColor}>
      <Flex direction="column" m="auto" textAlign="center" minWidth="300px">
        <Logo size="lg" />
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
