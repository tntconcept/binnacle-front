import React from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useFocus } from 'pages/login/useFocus'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import i18n from 'app/i18n'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Stack,
  useColorModeValue
} from '@chakra-ui/core'
import { PasswordInput } from './PasswordInput'
import { LogoAutentia } from 'core/components/LogoAutentia'
import { FloatingLabelInput } from 'core/components/FloatingLabelInput'

interface FormValues {
  username: string
  password: string
}

const schema = Yup.object().shape<FormValues>({
  username: Yup.string().required(i18n.t('form_errors.field_required')),
  password: Yup.string().required(i18n.t('form_errors.field_required'))
})

export function LoginForm() {
  const { t } = useTranslation()
  const [usernameRef, setUsernameFocus] = useFocus<HTMLInputElement>()
  const auth = useAuthentication()
  const history = useHistory()
  const labelBg = useColorModeValue('white', 'gray.800')

  return (
    <Formik
      initialValues={{
        username: '',
        password: ''
      }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          await auth.handleLogin(values.username, values.password)
          history.push('/binnacle')
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setUsernameFocus()
            resetForm()
          }
          setSubmitting(false)
        }
      }}
    >
      {(formik) => (
        <Flex direction="column" m="auto" minWidth="300px">
          <LogoAutentia size="lg" />
          <Form>
            <Heading as="h1" size="xl">
              {t('login_page.welcome_title')}
            </Heading>
            <Heading as="h2" size="lg">
              {t('login_page.welcome_message')}
            </Heading>
            <Stack spacing={4} mt={4}>
              <Field name="username">
                {({ field, meta }: FieldProps) => (
                  <FormControl id="username" isInvalid={meta.error !== undefined && meta.touched}>
                    <FloatingLabelInput
                      {...field}
                      label={t('login_page.username_field')}
                      labelBgColor={labelBg}
                      autoComplete="username"
                      autoFocus={true}
                      data-testid="username"
                      ref={usernameRef}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, meta }: FieldProps) => (
                  <FormControl id="password" isInvalid={meta.error !== undefined && meta.touched}>
                    <PasswordInput
                      {...field}
                      label={t('login_page.password_field')}
                      labelBgColor={labelBg}
                      autoComplete="current-password"
                      data-testid="password"
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={formik.isSubmitting}
                data-testid="login_button"
              >
                LOGIN
              </Button>
            </Stack>
          </Form>
        </Flex>
      )}
    </Formik>
  )
}
