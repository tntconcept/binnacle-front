import React from 'react'
import { ReactComponent as LogoAutentia } from 'assets/icons/logo.svg'
import styles from './LoginPage.module.css'
import { Button, PasswordField, Stack, TextField } from 'core/components'
import { Field, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useFocus } from 'pages/login/useFocus'
import { useAuthentication } from 'core/features/Authentication/Authentication'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import i18n from 'app/i18n'

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
        <div className={styles.formContainer}>
          <LogoAutentia className={styles.logo} />
          <form onSubmit={formik.handleSubmit}>
            <h1 className={styles.title}>{t('login_page.welcome_title')}</h1>
            <h2 className={styles.subtitle}>{t('login_page.welcome_message')}</h2>
            <Stack>
              <Field
                name="username"
                as={TextField}
                label={t('login_page.username_field')}
                autoFocus={true}
                innerRef={usernameRef}
                autoComplete="username"
                error={formik.errors.username && formik.touched.username}
                errorText={formik.errors.username}
                keepLabelUp={true}
              />
              <Field
                name="password"
                as={PasswordField}
                label={t('login_page.password_field')}
                autoComplete="current-password"
                error={formik.errors.password && formik.touched.password}
                errorText={formik.errors.password}
                keepLabelUp={true}
              />
              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                isFullWidth
                data-testid="login_button"
              >
                LOGIN
              </Button>
            </Stack>
          </form>
        </div>
      )}
    </Formik>
  )
}
