import {Form, FormikProps} from "formik"
import React from "react"
import {LoginFormValues} from "core/forms/LoginForm/loginFormSchema"
import {useTranslation} from "react-i18next"
import Button from "core/components/Button"
import TextField from "core/components/TextField/TextField"
import FieldMessage from "core/components/FieldMessage"

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
    <Form translate={"yes"}>
      {children}
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
      >
        {formikValues.errors.username && formikValues.touched.username && (
          <FieldMessage text={formikValues.errors.username!} isError={true} />
        )}
      </TextField>
      <TextField
        label={t("login_page.password_field")}
        id="password"
        name="password"
        onChange={formikValues.handleChange}
        onBlur={formikValues.handleBlur}
        value={formikValues.values.password}
        data-testid="password_input"
      >
        {formikValues.errors.password && formikValues.touched.password && (
          <FieldMessage text={formikValues.errors.password!} isError={true} />
        )}
      </TextField>
      <Button type="submit" isFullWidth={true} data-testid="login_button">
        LOGIN
      </Button>
    </Form>
  );
};
