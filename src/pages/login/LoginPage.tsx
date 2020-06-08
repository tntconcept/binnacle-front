import React, {useContext, useRef} from "react"
import {AuthContext} from "core/contexts/AuthContext"
import {Redirect} from "react-router-dom"
import {useTranslation} from "react-i18next"
import styles from "pages/login/LoginPage.module.css"
import {ReactComponent as LogoAutentia} from "assets/icons/logo.svg"
import Stack from "core/components/Stack"
import TextField from "core/components/TextField/TextField"
import Button from "core/components/Button"
import * as Yup from "yup"
import i18n from "i18n"
import {Field, Formik} from "formik"
import useTitle from "core/hooks/useTitle"
import PasswordField from "core/components/PasswordField"

// https://stackoverflow.com/questions/28889826/set-focus-on-input-after-render
const useFocus = <T, >(): [React.MutableRefObject<T | null>, () => void] => {
  const htmlElRef = useRef<T>(null)
  const setFocus = () => {
    htmlElRef.current && (htmlElRef.current as any).focus()
  }

  return [htmlElRef, setFocus]
}

interface FormValues {
  username: string;
  password: string;
}

const schema = Yup.object().shape<FormValues>({
  username: Yup.string().required(i18n.t("form_errors.field_required")),
  password: Yup.string().required(i18n.t("form_errors.field_required"))
})

const LoginPage: React.FC = () => {
  const [usernameRef, setUsernameFocus] = useFocus<HTMLInputElement>()
  useTitle("Login")
  const {t} = useTranslation()
  const auth = useContext(AuthContext)

  return auth.isAuthenticated ? (
    <Redirect to="/binnacle"/>
  ) : (
    <Formik
      initialValues={{
        username: "testuser",
        password: "holahola"
      }}
      validationSchema={schema}
      onSubmit={(values, {resetForm, setSubmitting}) => {
        auth.handleLogin(values.username, values.password)
          .catch(error => {
            if (error.response && error.response.status === 400) {
              setUsernameFocus()
              resetForm()
            }
            setSubmitting(false)
          })
      }}
    >
      {({handleSubmit, values, errors, touched, isSubmitting}) => (
        <div className={styles.pageContainer}>
          <div className={styles.formContainer}>
            <LogoAutentia className={styles.logo}/>
            <form onSubmit={handleSubmit}>
              <h1 className={styles.title}>{t("login_page.welcome_title")}</h1>
              <h2 className={styles.subtitle}>
                {t("login_page.welcome_message")}
              </h2>
              <Stack>
                <Field
                  name="username"
                  as={TextField}
                  label={t("login_page.username_field")}
                  autoFocus={values.username === ""}
                  data-testid="username_input"
                  innerRef={usernameRef}
                  autoComplete="username"
                  error={errors.username && touched.username}
                  errorText={errors.username}
                />
                <Field
                  name="password"
                  as={PasswordField}
                  label={t("login_page.password_field")}
                  data-testid="password_input"
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
