import {Form, FormikProps} from "formik"
import React from "react"
import {useTranslation} from "react-i18next"
import Button from "core/components/Button"
import TextField from "core/components/TextField/TextField"
import Stack from "core/forms/LoginForm/Stack"

export interface LoginFormProps {
  formikValues: FormikProps<any>;
  usernameRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formikValues,
  usernameRef,
  children
}) => {
  const { t } = useTranslation();

  return (
    <Form translate="yes">
      {children}
      <Stack>
        <TextField
          label={t("login_page.username_field")}
          name="username"
          id="username"
          // ref={usernameRef}
          onChange={formikValues.handleChange}
          onBlur={formikValues.handleBlur}
          value={formikValues.values.username}
          autoFocus={formikValues.values.username === ""}
          data-testid="username_input"
        />
        <TextField
          label={t("login_page.password_field")}
          id="password"
          name="password"
          onChange={formikValues.handleChange}
          onBlur={formikValues.handleBlur}
          value={formikValues.values.password}
          data-testid="password_input"
        />
        <Button type="submit" isFullWidth data-testid="login_button">
          LOGIN
        </Button>
      </Stack>
    </Form>
  );
};
