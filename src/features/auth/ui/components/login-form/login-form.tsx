import { Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
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

export const LoginForm: FC = () => {
  const { t } = useTranslation()

  const bgColor = useColorModeValue('white', undefined)
  const { executeUseCase: loginCmd } = useGetUseCase(LoginCmd)

  const { handleSubmit, register } = useForm<LoginFormSchema>({
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(loginFormSchema),
    mode: 'onSubmit'
  })

  const onSubmit = async (data: LoginFormSchema) => {
    await loginCmd(data)
  }

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
        <Stack as={'form'} id="login-form" spacing={6} mt={8} onSubmit={handleSubmit(onSubmit)}>
          <TextField label={t('login_page.username_field')} {...register('username')} />
          <TextField label={t('login_page.password_field')} {...register('password')} />
          <SubmitButton formId="login-form">LOGIN</SubmitButton>
        </Stack>

        <SignInWithGoogleButton />
      </Flex>
      <AppVersion />
    </Flex>
  )
}
