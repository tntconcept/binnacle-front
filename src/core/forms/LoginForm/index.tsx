import {Form, FormikProps} from "formik"
import React from "react"
import FormControl from "core/components/FormControl"
import TextInput from "core/components/TextInput"
import PasswordInput from "core/components/PasswordInput"
import Button from "core/components/Button"
import {LoginFormValues} from "core/forms/LoginForm/loginFormSchema"
import {useTranslation} from "react-i18next"

export interface LoginFormProps {
  formikValues: FormikProps<LoginFormValues>;
  usernameRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formikValues,
  usernameRef,
  children
}) => {
  const { t } = useTranslation();

  return (
    <Form
      translate={"yes"}
    >
      {children}
      <FormControl
        label={t("login_page.username_field")}
        error={
          formikValues.errors.username && formikValues.touched.username
            ? formikValues.errors.username
            : undefined
        }
      >
        <TextInput
          name="username"
          id="username"
          ref={usernameRef}
          onChange={formikValues.handleChange}
          onBlur={formikValues.handleBlur}
          value={formikValues.values.username}
          hasError={
            !!(formikValues.errors.username && formikValues.touched.username)
          }
          autoFocus={formikValues.values.username === ""}
          data-testid="username_input"
        />
      </FormControl>
      <FormControl
        label={t("login_page.password_field")}
        error={
          formikValues.errors.password && formikValues.touched.password
            ? formikValues.errors.password
            : undefined
        }
      >
        <PasswordInput
          id="password"
          name="password"
          onChange={formikValues.handleChange}
          onBlur={formikValues.handleBlur}
          value={formikValues.values.password}
          hasError={
            !!(formikValues.errors.password && formikValues.touched.password)
          }
          data-testid="password_input"
        />
      </FormControl>
      <Button
        type="submit"
        $isFullWidth={true}
        data-testid="login_button">
        LOGIN
      </Button>
    </Form>
  );
};
