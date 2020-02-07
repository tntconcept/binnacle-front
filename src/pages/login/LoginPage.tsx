import React, {useContext, useRef} from "react"
import {AuthContext} from "core/contexts/AuthContext"
import {Redirect} from "react-router-dom"
import DesktopLoginPageLayout from "desktop/layouts/DesktopLoginPageLayout"
import {useTranslation} from "react-i18next"
import styles from "desktop/layouts/DesktopLoginPageLayout.module.css"
import LogoAutentia from "assets/icons/logo.svg"
import Stack from "core/forms/LoginForm/Stack"
import TextField from "core/components/TextField/TextField"
import FieldMessage from "core/components/FieldMessage"
import Button from "core/components/Button"
import * as Yup from "yup"
import i18n from "i18n"
import {Field, Formik} from "formik"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"

// https://stackoverflow.com/questions/28889826/set-focus-on-input-after-render
const useFocus = <T,>(): [React.MutableRefObject<T | null>, () => void] => {
  const htmlElRef = useRef<T>(null);
  const setFocus = () => {
    htmlElRef.current && (htmlElRef.current as any).focus();
  };

  return [htmlElRef, setFocus];
};

const initialValues = { username: "testuser", password: "holahola" };
// const initialValues = { username: "", password: "" };

interface FormValues {
  username: string;
  password: string;
}

const schema = Yup.object().shape<FormValues>({
  username: Yup.string().required(i18n.t("form_errors.field_required")),
  password: Yup.string().required(i18n.t("form_errors.field_required"))
});

const LoginPage: React.FC = () => {
  // const [usernameRef, setUsernameFocus] = useFocus<HTMLInputElement>();
  const auth = useContext(AuthContext);
  const {dispatch} = useContext(SettingsContext)
  const { t } = useTranslation();

  return auth.isAuthenticated ? (
    <Redirect to="/binnacle" />
  ) : (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        auth
          .handleLogin(values.username, values.password)
          .then(_ => setSubmitting(false))
          .catch(error => {
            if (error.response && error.response.status === 401) {
              // setUsernameFocus();
              resetForm();
            } else {
              setSubmitting(false);
            }
          });
      }}
    >
      {({ handleSubmit, values, errors, touched }) => (
        <DesktopLoginPageLayout>
          <div className={styles.formContainer}>
            <img
              className={styles.logo}
              src={LogoAutentia}
              alt="Logo of Autentia"
            />
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
                >
                  <FieldMessage
                    isError={errors.username && touched.username}
                    errorText={errors.username}
                  />
                </Field>
                <Field
                  name="password"
                  as={TextField}
                  label={t("login_page.password_field")}
                  data-testid="password_input"
                >
                  <FieldMessage
                    isError={errors.password && touched.password}
                    errorText={errors.password}
                  />
                </Field>
                <Button type="submit" isFullWidth data-testid="login_button">
                  LOGIN
                </Button>
              </Stack>
            </form>
          </div>
        </DesktopLoginPageLayout>
      )}
    </Formik>
  );
};

export default LoginPage;
