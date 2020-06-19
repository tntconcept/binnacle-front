import React from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './LoginPage.module.css'
import { ReactComponent as LogoAutentia } from 'assets/icons/logo.svg'
import { Button, PasswordField, Stack, TextField } from 'common/components'
import { useTitle } from 'common/hooks'
import * as Yup from 'yup'
import i18n from 'i18n'
import { Field, Formik } from 'formik'
import { useAuthentication } from 'features/Authentication'
import { useFocus } from './useFocus'

interface FormValues {
  username: string
  password: string
}

const schema = Yup.object().shape<FormValues>({
  username: Yup.string().required(i18n.t('form_errors.field_required')),
  password: Yup.string().required(i18n.t('form_errors.field_required'))
})

const LoginPage: React.FC = () => {
  useTitle('Login')
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
      {({ handleSubmit, values, errors, touched, isSubmitting }) => (
        <div className={styles.pageContainer}>
          <div className={styles.formContainer}>
            <LogoAutentia className={styles.logo} />
            <form onSubmit={handleSubmit}>
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
                  error={errors.username && touched.username}
                  errorText={errors.username}
                />
                <Field
                  name="password"
                  as={PasswordField}
                  label={t('login_page.password_field')}
                  autoComplete="current-password"
                  error={errors.password && touched.password}
                  errorText={errors.password}
                />
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  isFullWidth
                  data-testid="login_button"
                >
                  LOGIN
                </Button>
              </Stack>
            </form>
          </div>
          <p className={styles.version}>v{process.env.REACT_APP_VERSION}</p>
        </div>
      )}
    </Formik>
  )
}

export default LoginPage
