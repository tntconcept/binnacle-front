import { Box, Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import { AppVersion } from '../../../../version/ui/components/app-version'
import { useTranslation } from 'react-i18next'
import { Logo } from '../../../../../shared/components/logo'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginFormSchema, loginFormSchema } from './login-form.schema'
import { TextField } from '../../../../../shared/components/form-fields/text-field'
import { SubmitButton } from '../../../../../shared/components/form-fields/submit-button'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { LoginCmd } from '../../../application/login-cmd'
import { SignInWithGoogleButton } from '../sign-in-with-google/sign-in-with-google-button'
import { useAuthContext } from '../../../../../shared/contexts/auth-context'
import { PasswordField } from '../../../../../shared/components/form-fields/password-field'

export const LoginForm: FC = () => {
  const { t } = useTranslation()
  const { checkLoggedUser } = useAuthContext()

  const bgColor = useColorModeValue('white', undefined)
  const { executeUseCase: loginCmd } = useGetUseCase(LoginCmd)

  const showLDAPLogin = true
  const showGoogleLogin = false

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginFormSchema>({
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(loginFormSchema),
    mode: 'onSubmit'
  })

  const onSubmit = async (data: LoginFormSchema) => {
    await loginCmd(data)
    await checkLoggedUser!()
  }

  return (
    <Flex direction="column" height="100%" bgColor={bgColor}>
      <Flex direction="column" m="auto" minWidth="300px" textAlign="center">
        <Logo size="lg" />
        <Heading as="h1" size="xl">
          {t('login_page.welcome_title')}
        </Heading>
        <Heading as="h2" size="md" mt={2} mb={8}>
          {t('login_page.welcome_message')}
        </Heading>

        <Flex direction="column" textAlign={'start'} gap={8}>
          {showLDAPLogin && (
            <Stack
              direction={'column'}
              as="form"
              id="login-form"
              spacing={6}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Box>
                <TextField
                  label={t('login_page.username_field')}
                  error={errors.username?.message}
                  {...register('username')}
                />
              </Box>

              <Box>
                <PasswordField
                  label={t('login_page.password_field')}
                  error={errors.password?.message}
                  {...register('password')}
                />
              </Box>
              <SubmitButton formId="login-form">{t('login_page.login')}</SubmitButton>
            </Stack>
          )}

          {showGoogleLogin && <SignInWithGoogleButton />}
        </Flex>
      </Flex>
      <AppVersion />
    </Flex>
  )
}
