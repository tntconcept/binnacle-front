import { Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import { AppVersion } from 'modules/login/components/AppVersion'
import { useLoginForm } from 'modules/login/components/LoginForm/useLoginForm'
import { PasswordField } from 'modules/login/components/PasswordField/PasswordField'
import { useTranslation } from 'react-i18next'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { TextField } from 'shared/components/FormFields/TextField'
import { LogoAutentia } from 'shared/components/LogoAutentia'

export const LoginForm = () => {
  const { t } = useTranslation()
  const form = useLoginForm()

  const bgColor = useColorModeValue('white', undefined)

  return (
    <Flex direction="column" height="100%" bgColor={bgColor}>
      <Flex direction="column" m="auto" minWidth="300px">
        <LogoAutentia size="lg" />
        <form data-testid="login-form" onSubmit={form.onSubmit}>
          <Heading as="h1" size="xl">
            {t('login_page.welcome_title')}
          </Heading>
          <Heading as="h2" size="lg">
            {t('login_page.welcome_message')}
          </Heading>
          <Stack spacing={6} mt={8}>
            <TextField
              label={t('login_page.username_field')}
              autoComplete="username"
              autoFocus={true}
              {...form.register('username', { required: true })}
              error={form.errors.username && t('form_errors.field_required')}
            />
            <PasswordField
              label={t('login_page.password_field')}
              {...form.register('password', { required: true })}
              error={form.errors.password && t('form_errors.field_required')}
            />
            <SubmitButton isLoading={form.isLoading}>LOGIN</SubmitButton>
          </Stack>
        </form>
      </Flex>
      <AppVersion />
    </Flex>
  )
}
